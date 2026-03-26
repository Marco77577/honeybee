package com.accounting.api.organization

import com.accounting.api.organization.model.CreateOrganization
import com.accounting.api.organization.model.PublicOrganization
import com.accounting.api.organization.model.UpdateOrganization
import com.accounting.config.Error
import com.accounting.config.authentication.OIDC_AUTH
import com.accounting.config.authentication.assertIsAdmin
import com.accounting.config.authentication.assertIsOwner
import com.accounting.config.authentication.assertMayWriteOrganization
import com.accounting.config.authentication.requireUser
import com.accounting.database.organization.OrganizationRepository
import io.github.smiley4.ktoropenapi.*
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
                        .findAllByUser(user.id)
                        .map { PublicOrganization.from(it) }
                )
            }

            post(
                builder = {
                    description = "Create a new organization"
                    tags = listOf("organization")
                    request {
                        body<CreateOrganization> {
                            description = "new organization"
                        }
                    }
                    response {
                        code(HttpStatusCode.Created) {
                            description = "organization"
                            body<PublicOrganization>()
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val user = requireUser()
                val createOrganization = call.receive<CreateOrganization>()

                val organization = organizationRepository.createOrganization(
                    createOrganization = createOrganization,
                    user = user,
                )
                call.respond(
                    HttpStatusCode.Created,
                    PublicOrganization.from(organization)
                )
            }

            patch(
                builder = {
                    description = "Update an organization"
                    tags = listOf("organization")
                    request {
                        body<UpdateOrganization> {
                            description = "updated organization"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.OK) {
                            description = "organization"
                            body<PublicOrganization>()
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                assertIsAdmin()
                val updateOrganization = call.receive<UpdateOrganization>()

                val organization = organizationRepository.updateOrganization(
                    updateOrganization = updateOrganization,
                )
                call.respond(
                    HttpStatusCode.OK,
                    PublicOrganization.from(organization)
                )
            }

            delete(
                "/{organizationId}",
                builder = {
                    description = "Delete an organization"
                    tags = listOf("organization")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization that is to be deleted"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.NoContent) {
                            description = "organization deleted"
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertIsOwner()

                organizationRepository.deleteOrganization(
                    organizationId = organizationId,
                )

                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}