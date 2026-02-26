package com.accounting.api.user

import com.accounting.config.authentication.OIDC_AUTH
import io.github.smiley4.ktoropenapi.get
import io.github.smiley4.ktoropenapi.route
import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.user() {
    authenticate(OIDC_AUTH) {
        route("/user", {
            securitySchemeNames(OIDC_AUTH)
        }) {
            get(
                builder = {
                    description = "Get user info"
                    tags = listOf("user")
                    response {
                        code(HttpStatusCode.OK) {
                            description = "User info"
                            body<String>()
                        }
                    }
                }
            ) {
                call.respondText("Hello World!")
            }
        }
    }
}