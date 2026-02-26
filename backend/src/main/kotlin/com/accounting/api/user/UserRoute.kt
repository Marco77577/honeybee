package com.accounting.api.user

import com.accounting.config.authentication.OIDC_AUTH
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.user() {
    authenticate(OIDC_AUTH) {
        route("/user") {
            get {
                call.respondText("Hello World!")
            }
        }
    }
}