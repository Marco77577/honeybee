package com.accounting.api.account

import com.accounting.config.authentication.OIDC_AUTH
import io.github.smiley4.ktoropenapi.route
import io.ktor.server.auth.*
import io.ktor.server.routing.*

fun Route.account() {
    authenticate(OIDC_AUTH) {
        route("/account/{organizationId}", {
            securitySchemeNames(OIDC_AUTH)
        }) {

        }
    }
}