package com.accounting.api

import com.accounting.api.user.user
import com.accounting.util.isProduction
import io.github.smiley4.ktoropenapi.openApi
import io.github.smiley4.ktorswaggerui.swaggerUI
import io.ktor.server.application.*
import io.ktor.server.routing.*

private const val OPEN_API_PATH = "/openapi/api.json"

fun Application.configureApi() {
    routing {
        if (!isProduction()) {
            route(OPEN_API_PATH) {
                openApi()
            }

            route("swagger") {
                swaggerUI(OPEN_API_PATH)
            }
        }

        route("/api/v1") {
            user()
        }
    }
}