package com.accounting.api

import com.accounting.api.account.account
import com.accounting.api.category.category
import com.accounting.api.currency.currency
import com.accounting.api.organization.organization
import com.accounting.api.transaction.transaction
import com.accounting.util.isProduction
import io.github.smiley4.ktoropenapi.get
import io.github.smiley4.ktoropenapi.openApi
import io.github.smiley4.ktoropenapi.route
import io.github.smiley4.ktorswaggerui.swaggerUI
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

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
            organization()
            currency()
            category()
            account()
            transaction()
        }

        get("/health", {
            tags = listOf("health")
            description = "Health check"
        }) {
            call.respondText("OK")
        }
    }
}