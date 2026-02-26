package com.accounting.api

import com.accounting.api.user.user
import com.accounting.util.isProduction
import io.github.smiley4.ktoropenapi.openApi
import io.github.smiley4.ktoropenapi.route
import io.github.smiley4.ktorswaggerui.swaggerUI
import io.ktor.server.application.*
import io.ktor.server.auth.authentication
import io.ktor.server.routing.*
import io.ktor.server.routing.openapi.registerBasicAuthSecurityScheme

private const val OPEN_API_PATH = "/openapi/api.json"

fun Application.configureApi() {
    routing {
        if (!isProduction()) {
            route(OPEN_API_PATH) {
                openApi()
            }

            route("swagger") {
                swaggerUI(OPEN_API_PATH) {
                    oauth2RedirectUrl = "http://localhost:8080/swagger/oauth2-redirect.html"
                }
            }
        }

        route("/api/v1", {
            tags = listOf("v1")
        }) {
            user()
        }
    }
}