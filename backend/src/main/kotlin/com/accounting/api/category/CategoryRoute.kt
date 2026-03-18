package com.accounting.api.category

import com.accounting.api.category.model.CreateCategory
import com.accounting.api.category.model.PublicCategory
import com.accounting.api.category.model.UpdateCategory
import com.accounting.config.Error
import com.accounting.config.authentication.OIDC_AUTH
import com.accounting.config.authentication.assertMayReadOrganization
import com.accounting.config.authentication.assertMayWriteOrganization
import com.accounting.database.category.CategoryRepository
import io.github.smiley4.ktoropenapi.*
import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.*
import org.koin.ktor.ext.inject

fun Route.category() {
    val categoryRepository by inject<CategoryRepository>()

    authenticate(OIDC_AUTH) {
        route("/category/{organizationId}", {
            securitySchemeNames(OIDC_AUTH)
        }) {
            get(
                builder = {
                    description = "Get categories of an organization"
                    tags = listOf("category")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the categories"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.OK) {
                            description = "categories of an organization"
                            body<List<PublicCategory>>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayReadOrganization()

                call.respond(
                    categoryRepository
                        .findAllByOrganization(organizationId)
                        .map { PublicCategory.from(it) }
                )
            }

            post(
                builder = {
                    description = "Create a new category"
                    tags = listOf("category")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the categories"
                            required = true
                        }
                        body<CreateCategory> {
                            description = "new category"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.Created) {
                            description = "category"
                            body<PublicCategory>()
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayWriteOrganization()
                val createCategory = call.receive<CreateCategory>()

                val category = categoryRepository.createCategory(
                    createCategory = createCategory,
                    organizationId = organizationId,
                )
                call.respond(
                    HttpStatusCode.Created,
                    PublicCategory.from(category)
                )
            }

            patch(
                builder = {
                    description = "Update a category"
                    tags = listOf("category")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the categories"
                            required = true
                        }
                        body<UpdateCategory> {
                            description = "updated category"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.OK) {
                            description = "category"
                            body<PublicCategory>()
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayWriteOrganization()
                val updateCategory = call.receive<UpdateCategory>()

                val category = categoryRepository.updateCategory(
                    updateCategory = updateCategory,
                    organizationId = organizationId,
                )
                call.respond(
                    HttpStatusCode.OK,
                    PublicCategory.from(category)
                )
            }

            delete(
                "/{categoryId}",
                builder = {
                    description = "Delete a category"
                    tags = listOf("category")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the category"
                            required = true
                        }
                        pathParameter<String>("categoryId") {
                            description = "The id of the category that is to be deleted"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.NoContent) {
                            description = "category deleted"
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayWriteOrganization()
                val categoryId = call.parameters.getOrFail("categoryId")

                categoryRepository.deleteCategory(
                    organizationId = organizationId,
                    categoryId = categoryId
                )

                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}