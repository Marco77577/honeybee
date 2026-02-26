package com.accounting.config


import com.accounting.config.authentication.OIDC_AUTH
import com.accounting.config.authentication.OidcDiscovery
import io.github.smiley4.ktoropenapi.OpenApi
import io.github.smiley4.ktoropenapi.config.AuthType
import io.github.smiley4.ktoropenapi.config.OutputFormat
import io.ktor.server.application.*

fun Application.configureDocumentation(oidcDiscovery: OidcDiscovery) {
    val authorizationUrl = oidcDiscovery.discover(OidcDiscovery.Data.AUTHORIZATION_ENDPOINT)
    val tokenUrl = oidcDiscovery.discover(OidcDiscovery.Data.TOKEN_ENDPOINT)

    install(OpenApi) {
        info {
            title = "Honeybee API"
            version = "1.0.0"
            description = "The API of the Honeybee backend."
        }
        security {
            securityScheme(OIDC_AUTH) {
                type = AuthType.OAUTH2
                flows {
                    implicit {
                        this.authorizationUrl = authorizationUrl.toString()
                        this.tokenUrl = tokenUrl.toString()
                        scopes = mapOf(
                            "openid" to "OpenID Connect",
                            "profile" to "User profile",
                            "email" to "User email"
                        )
                    }
                }
            }
        }
        outputFormat = OutputFormat.JSON
    }
}