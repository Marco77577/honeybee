package com.accounting.config

import com.accounting.config.authentication.AuthenticatedUser
import com.accounting.config.authentication.OIDC_AUTH
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.respondText(text = "500: $cause", status = HttpStatusCode.InternalServerError)
        }
    }
    routing {
        get("/") {
            call.respondText("Hello World!")
        }

        get("/health") {
            call.respondText("OK")
        }

        authenticate(OIDC_AUTH) {
            get("/api/protected") {
                val principal = requirePrincipal()
                call.respondText(principal.email)
            }
        }
    }
}

/**
 * Asserts that the current call has an authenticated principal.
 * @return the authenticated principal.
 */
fun RoutingContext.requirePrincipal(): AuthenticatedUser =
    call.principal<AuthenticatedUser>() ?: error("No principal found — is this route inside an authenticate block?")