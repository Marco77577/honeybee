package com.accounting.api.currency

import com.accounting.api.currency.model.PublicCurrency
import com.accounting.api.organization.model.PublicOrganization
import com.accounting.config.authentication.OIDC_AUTH
import com.accounting.config.authentication.assertMayRead
import com.accounting.database.currency.CurrencyRepository
import io.github.smiley4.ktoropenapi.get
import io.github.smiley4.ktoropenapi.route
import io.ktor.http.*
import io.ktor.server.auth.*
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
                val organizationId = call.parameters.getOrFail("organizationId")
                assertMayRead(organizationId)

                call.respond(
                    currencyRepository
                        .findAllByOrganization(organizationId)
                        .map { PublicCurrency.from(it) }
                )
            }
        }
    }
}