package com.accounting.api.currency

import com.accounting.api.currency.model.CreateCurrency
import com.accounting.api.currency.model.PublicCurrency
import com.accounting.api.currency.model.UpdateCurrency
import com.accounting.config.Error
import com.accounting.config.authentication.OIDC_AUTH
import com.accounting.config.authentication.assertMayReadOrganization
import com.accounting.config.authentication.assertMayWriteOrganization
import com.accounting.database.currency.CurrencyRepository
import io.github.smiley4.ktoropenapi.*
import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.*
import org.koin.ktor.ext.inject

fun Route.currency() {
    val currencyRepository by inject<CurrencyRepository>()

    authenticate(OIDC_AUTH) {
        route("/currency/{organizationId}", {
            securitySchemeNames(OIDC_AUTH)
        }) {
            get(
                builder = {
                    description = "Get currencies of an organization"
                    tags = listOf("currency")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the currencies"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.OK) {
                            description = "currencies of an organization"
                            body<List<PublicCurrency>>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayReadOrganization()

                call.respond(
                    currencyRepository
                        .findAllByOrganization(organizationId)
                        .map { PublicCurrency.from(it) }
                )
            }

            post(
                builder = {
                    description = "Create a new currency"
                    tags = listOf("currency")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the currencies"
                            required = true
                        }
                        body<CreateCurrency> {
                            description = "new currency"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.Created) {
                            description = "currency"
                            body<PublicCurrency>()
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayWriteOrganization()
                val createCurrency = call.receive<CreateCurrency>()

                val currency = currencyRepository.createCurrency(
                    createCurrency = createCurrency,
                    organizationId = organizationId,
                )
                call.respond(
                    HttpStatusCode.Created,
                    PublicCurrency.from(currency)
                )
            }

            patch(
                builder = {
                    description = "Update a currency"
                    tags = listOf("currency")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the currencies"
                            required = true
                        }
                        body<UpdateCurrency> {
                            description = "updated currency"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.OK) {
                            description = "currency"
                            body<PublicCurrency>()
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayWriteOrganization()
                val updateCurrency = call.receive<UpdateCurrency>()

                val currency = currencyRepository.updateCurrency(
                    updateCurrency = updateCurrency,
                    organizationId = organizationId,
                )
                call.respond(
                    HttpStatusCode.OK,
                    PublicCurrency.from(currency)
                )
            }

            delete(
                "/{currencyId}",
                builder = {
                    description = "Delete a currency"
                    tags = listOf("currency")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the currency"
                            required = true
                        }
                        pathParameter<String>("currencyId") {
                            description = "The id of the currency that is to be deleted"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.NoContent) {
                            description = "currency deleted"
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayWriteOrganization()
                val currencyId = call.parameters.getOrFail("currencyId")

                currencyRepository.deleteCurrency(
                    organizationId = organizationId,
                    currencyId = currencyId
                )

                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}