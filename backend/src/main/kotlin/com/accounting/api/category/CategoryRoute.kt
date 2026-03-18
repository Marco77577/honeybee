package com.accounting.api.category

import com.accounting.config.authentication.OIDC_AUTH
import io.github.smiley4.ktoropenapi.route
import io.ktor.server.auth.*
import io.ktor.server.routing.*

fun Route.category() {
    authenticate(OIDC_AUTH) {
        route("/category/{organizationId}", {
            securitySchemeNames(OIDC_AUTH)
        }) {

        }
    }
}