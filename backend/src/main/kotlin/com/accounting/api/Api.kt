package com.accounting.api

import com.accounting.api.user.user
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Application.configureApi() {
    routing {
        route("/api/v1") {
            user()
        }
    }
}