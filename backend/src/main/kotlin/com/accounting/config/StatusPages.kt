package com.accounting.config

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.requestvalidation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.exceptions.ExposedSQLException

class NotAuthenticatedException : Exception("user is not authenticated")
class NotAllowedToViewOrganization : Exception("user may not view organization")
class NotAllowedToWriteOrganization : Exception("user may not write organization")

@Serializable
data class Error(
    val statusCode: Int,
    val errorCode: Int,
    val message: String,
)

fun Application.configureStatusPages() {
    install(StatusPages) {
        exception<RequestValidationException> { call, cause ->
            call.respond(
                HttpStatusCode.BadRequest,
                Error(
                    statusCode = HttpStatusCode.BadRequest.value,
                    errorCode = 1,
                    message = cause.message ?: "Bad Request"
                )
            )
        }
        exception<NotAllowedToWriteOrganization> { call, cause ->
            call.respond(
                HttpStatusCode.Forbidden,
                Error(
                    statusCode = HttpStatusCode.Forbidden.value,
                    errorCode = 2,
                    message = cause.message ?: "Forbidden"
                )
            )
        }
        exception<NotAllowedToViewOrganization> { call, cause ->
            call.respond(
                HttpStatusCode.Forbidden,
                Error(
                    statusCode = HttpStatusCode.Forbidden.value,
                    errorCode = 3,
                    message = cause.message ?: "Forbidden"
                )
            )
        }
        exception<NotAuthenticatedException> { call, cause ->
            call.respond(
                HttpStatusCode.Unauthorized,
                Error(
                    statusCode = HttpStatusCode.Unauthorized.value,
                    errorCode = 4,
                    message = cause.message ?: "Unauthorized"
                )
            )
        }
        exception<ExposedSQLException> { call, cause ->
            call.respond(
                HttpStatusCode.BadRequest,
                Error(
                    statusCode = HttpStatusCode.BadRequest.value,
                    errorCode = 5,
                    message = cause.message ?: "Bad Request"
                )
            )
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