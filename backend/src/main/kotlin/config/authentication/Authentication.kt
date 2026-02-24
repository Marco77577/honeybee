package config.authentication

import com.auth0.jwk.JwkProvider
import com.auth0.jwk.JwkProviderBuilder
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.InvalidClaimException
import com.auth0.jwt.exceptions.JWTVerificationException
import com.auth0.jwt.exceptions.TokenExpiredException
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonPrimitive
import java.net.URI
import java.net.URL
import java.security.interfaces.RSAPublicKey
import java.util.concurrent.TimeUnit

const val OIDC_AUTH = "oidc"

fun Application.configureSecurity() {
    val oidcRealm = System.getenv("OIDC_REALM") ?: error("OIDC_REALM environment variable is not set")
    val audience = System.getenv("OIDC_CLIENT_ID") ?: error("OIDC_CLIENT_ID environment variable is not set")
    val issuer = System.getenv("OIDC_ISSUER") ?: error("OIDC_ISSUER environment variable is not set")

    val jwksUrl = runBlocking { discoverJwksUrl(issuer) }
    val jwkProvider = JwkProviderBuilder(jwksUrl)
        .cached(10, 24, TimeUnit.HOURS)
        .rateLimited(10, 1, TimeUnit.MINUTES)
        .build()

    authentication {
        jwt(OIDC_AUTH) {
            realm = oidcRealm
            verifier(jwkProvider, issuer) {
                acceptLeeway(3)
            }
            validate { credential ->
                if (credential.payload.audience.contains(audience)) {
                    AuthenticatedUser(
                        id = credential.payload.subject,
                        email = credential.payload.getClaim("email").asString() ?: return@validate null,
                        isEmailAddressVerified = credential.payload.getClaim("email_verified").asBoolean() ?: false,
                        name = credential.payload.getClaim("name").asString(),
                        familyName = credential.payload.getClaim("family_name").asString(),
                        givenName = credential.payload.getClaim("given_name").asString(),
                        username = credential.payload.getClaim("preferred_username").asString()
                    )
                } else {
                    null
                }
            }
            challenge { _, _ ->
                with(this@configureSecurity) {
                    analyzeError(jwkProvider, issuer)
                }
                call.respond(HttpStatusCode.Unauthorized, "Token invalid or expired")
            }
        }
    }
}

/**
 * Discovers the JWKS URL from the OIDC discovery document.
 * @param issuer the OIDC issuer URL.
 * @return The JWKS URL.
 */
private suspend fun discoverJwksUrl(issuer: String): URL = try {
    val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json()
        }
    }

    val config = client
        .get("$issuer/.well-known/openid-configuration")
        .body<JsonObject>()
    client.close()

    val jwksUri = config["jwks_uri"]?.jsonPrimitive?.content
        ?: error("jwks_uri not found in OIDC discovery document")

    return URI(jwksUri).toURL()
} catch (e: Exception) {
    error("Failed to discover JWKS URL from OIDC discovery document: ${e.message}")
}

/**
 * Analyzes the exact error message of the JWT verification exception.
 * @param jwkProvider the JWK provider.
 * @param issuer the OIDC issuer URL.
 */
context(application: Application)
private fun JWTChallengeContext.analyzeError(jwkProvider: JwkProvider, issuer: String) {
    val token = call.request.headers["Authorization"]?.removePrefix("Bearer ")
    if (token != null) {
        try {
            val decoded = JWT.decode(token)
            val jwk = jwkProvider.get(decoded.keyId)
            val algorithm = Algorithm.RSA256(
                jwk.publicKey as RSAPublicKey,
                null
            )
            JWT.require(algorithm)
                .withIssuer(issuer)
                .build()
                .verify(decoded)
        } catch (e: TokenExpiredException) {
            application.log.warn("Token is expired: ${e.message}")
        } catch (e: InvalidClaimException) {
            application.log.warn("Invalid claim: ${e.message}")
        } catch (e: JWTVerificationException) {
            application.log.warn("Verification failed: ${e.message}")
        } catch (e: Exception) {
            application.log.error("Unexpected error: ${e.message}")
        }
    }
}
