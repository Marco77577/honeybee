package com.accounting.api.organization

import com.accounting.api.organization.model.NewOrganization
import com.accounting.api.organization.model.PublicOrganization
import com.accounting.config.authentication.OIDC_AUTH
import com.accounting.config.authentication.requireUser
import com.accounting.database.organization.OrganizationRepository
import io.github.smiley4.ktoropenapi.get
import io.github.smiley4.ktoropenapi.post
import io.github.smiley4.ktoropenapi.route
import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Route.organization() {
    val organizationRepository by inject<OrganizationRepository>()

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
                call.respond(
                    organizationRepository
                        .findByUser(user.id)
                        .map { PublicOrganization.from(it) }
                )
            }

            post(
                builder = {
                    description = "Create a new organization"
                    tags = listOf("organization")
                    request {
                        body<NewOrganization> {
                            description = "new organization"
                        }
                    }
                    response {
                        code(HttpStatusCode.OK) {
                            description = "organization"
                            body<PublicOrganization>()
                        }
                    }
                }
            ) {
                val user = requireUser()
                val newOrganization = call.receive<NewOrganization>()
                
                val organization = organizationRepository.createOrganization(
                    newOrganization = newOrganization,
                    user = user,
                )
                call.respond(
                    PublicOrganization.from(organization)
                )
            }
        }
    }
}