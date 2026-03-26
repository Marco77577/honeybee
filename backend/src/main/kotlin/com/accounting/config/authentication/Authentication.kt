package com.accounting.config.authentication

import com.accounting.config.NotAdmin
import com.accounting.config.NotAllowedToViewOrganization
import com.accounting.config.NotAuthenticatedException
import com.accounting.config.NotOwner
import com.accounting.database.user.UserRepository
import com.auth0.jwk.JwkProvider
import com.auth0.jwk.JwkProviderBuilder
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.InvalidClaimException
import com.auth0.jwt.exceptions.JWTVerificationException
import com.auth0.jwt.exceptions.TokenExpiredException
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.*
import org.koin.ktor.ext.inject
import java.security.interfaces.RSAPublicKey
import java.util.concurrent.TimeUnit

const val OIDC_AUTH = "oidc"

fun Application.configureAuthentication(oidcDiscovery: OidcDiscovery) {
    val oidcRealm = System.getenv("OIDC_REALM") ?: error("OIDC_REALM environment variable is not set")
    val audience = System.getenv("OIDC_CLIENT_ID") ?: error("OIDC_CLIENT_ID environment variable is not set")
    val issuer = System.getenv("OIDC_ISSUER") ?: error("OIDC_ISSUER environment variable is not set")

    val jwksUrl = oidcDiscovery.discover(OidcDiscovery.Data.JWKS_URI)
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
                with(this@configureAuthentication) {
                    analyzeError(jwkProvider, issuer)
                }
                call.respond(HttpStatusCode.Unauthorized, "Token invalid or expired")
            }
        }
    }
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

/**
 * Asserts that the current call has an authenticated principal.
 * @return the authenticated principal.
 * @throws NotAuthenticatedException if the call is not authenticated.
 */
fun RoutingContext.requireUser(): AuthenticatedUser =
    call.principal<AuthenticatedUser>() ?: throw NotAuthenticatedException()

/**
 * Asserts that the current user is allowed to read the given organization.
 * @throws NotAllowedToViewOrganization if the user is not allowed to read the organization.
 */
context(route: Route)
fun RoutingContext.assertMayReadOrganization(): String {
    val organizationId = call.parameters.getOrFail("organizationId")
    val userRepository by route.inject<UserRepository>()
    val user = requireUser()
    if (!userRepository.mayRead(user.id, organizationId)) throw NotAllowedToViewOrganization()
    return organizationId
}

/**
 * Asserts that the current user is allowed to write to the given organization.
 * @throws NotAllowedToViewOrganization if the user is not allowed to write to the organization.
 */
context(route: Route)
fun RoutingContext.assertMayWriteOrganization(): String {
    val organizationId = call.parameters.getOrFail("organizationId")
    val userRepository by route.inject<UserRepository>()
    val user = requireUser()
    if (!userRepository.mayWrite(user.id, organizationId)) throw NotAllowedToViewOrganization()
    return organizationId
}

/**
 * Asserts that the current user is the owner of an organization.
 * @throws NotAllowedToViewOrganization if the user is not the owner of the organization.
 */
context(route: Route)
fun RoutingContext.assertIsOwner(): String {
    val organizationId = call.parameters.getOrFail("organizationId")
    val userRepository by route.inject<UserRepository>()
    val user = requireUser()
    if (!userRepository.isOwner(user.id, organizationId)) throw NotOwner()
    return organizationId
}

/**
 * Asserts that the current user is the owner of an organization.
 * @throws NotAllowedToViewOrganization if the user is not the owner of the organization.
 */
context(route: Route)
fun RoutingContext.assertIsAdmin(): String {
    val organizationId = call.parameters.getOrFail("organizationId")
    val userRepository by route.inject<UserRepository>()
    val user = requireUser()
    if (!userRepository.isAdmin(user.id, organizationId)) throw NotAdmin()
    return organizationId
}
