package com.accounting.config

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

class NotAuthenticatedException : Exception("user is not authenticated")
class NotAllowedToViewOrganization : Exception("user may not view organization")

fun Application.configureStatusPages() {
    install(StatusPages) {
        exception<NotAllowedToViewOrganization> { call, cause ->
            call.respond(HttpStatusCode.Forbidden, cause.message ?: "Forbidden")
        }
        exception<NotAuthenticatedException> { call, cause ->
            call.respond(HttpStatusCode.Unauthorized, cause.message ?: "Unauthorized")
        }
        exception<Throwable> { call, cause ->
            call.respondText(text = "500: $cause", status = HttpStatusCode.InternalServerError)
        }
    }
    routing {
        get("/health") {
            call.respondText("OK")
        }
    }
}