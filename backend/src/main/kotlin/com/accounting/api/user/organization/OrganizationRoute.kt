package com.accounting.api.user.organization

import com.accounting.api.user.organization.model.PublicOrganization
import com.accounting.config.authentication.OIDC_AUTH
import com.accounting.config.authentication.requireUser
import com.accounting.database.organization.OrganizationRepository
import io.github.smiley4.ktoropenapi.get
import io.github.smiley4.ktoropenapi.route
import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Route.organization() {
    authenticate(OIDC_AUTH) {
        route("/organization", {
            securitySchemeNames(OIDC_AUTH)
        }) {
            get(
                builder = {
                    description = "Get organizations of a user"
                    tags = listOf("organization")
                    response {
                        code(HttpStatusCode.OK) {
                            description = "organizations"
                            body<List<PublicOrganization>>()
                        }
                    }
                }
            ) {
                val user = requireUser()
                val organizationRepository by inject<OrganizationRepository>()
                call.respond(
                    organizationRepository
                        .findByUser(user.id)
                        .map { PublicOrganization.from(it) }
                )
            }
        }
    }
}