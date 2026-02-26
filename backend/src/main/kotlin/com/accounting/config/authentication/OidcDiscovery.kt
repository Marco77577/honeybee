package com.accounting.config.authentication

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonPrimitive
import java.net.URI
import java.net.URL

/**
 * Allows to discover data from OIDC discovery document.
 */
class OidcDiscovery {

    enum class Data(val key: String) {
        AUTHORIZATION_ENDPOINT("authorization_endpoint"),
        TOKEN_ENDPOINT("token_endpoint"),
        JWKS_URI("jwks_uri"),
    }

    /**
     * Discovers data from OIDC discovery document.
     * @param type The type of the data that is to be discovered.
     * @return The data.
     */
    fun discover(type: Data): URL = runBlocking {
        try {
            val issuer = System.getenv("OIDC_ISSUER") ?: error("OIDC_ISSUER environment variable is not set")

            val client = HttpClient(CIO) {
                install(ContentNegotiation) {
                    json()
                }
            }

            val config = client
                .get("$issuer/.well-known/openid-configuration")
                .body<JsonObject>()
            client.close()

            val jwksUri = config[type.key]?.jsonPrimitive?.content
                ?: error("jwks_uri not found in OIDC discovery document")

            URI(jwksUri).toURL()
        } catch (e: Exception) {
            error("Failed to discover JWKS URL from OIDC discovery document: ${e.message}")
        }
    }
}