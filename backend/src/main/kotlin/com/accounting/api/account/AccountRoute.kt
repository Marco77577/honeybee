package com.accounting.api.account

import com.accounting.api.account.model.CreateAccount
import com.accounting.api.account.model.PublicAccount
import com.accounting.api.account.model.UpdateAccount
import com.accounting.config.Error
import com.accounting.config.authentication.OIDC_AUTH
import com.accounting.config.authentication.assertMayReadOrganization
import com.accounting.config.authentication.assertMayWriteOrganization
import com.accounting.database.account.AccountRepository
import io.github.smiley4.ktoropenapi.*
import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.*
import org.koin.ktor.ext.inject

fun Route.account() {
    val accountRepository by inject<AccountRepository>()

    authenticate(OIDC_AUTH) {
        route("/account/{organizationId}", {
            securitySchemeNames(OIDC_AUTH)
        }) {
            get(
                builder = {
                    description = "Get accounts of an organization"
                    tags = listOf("account")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the accounts"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.OK) {
                            description = "accounts of an organization"
                            body<List<PublicAccount>>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayReadOrganization()

                call.respond(
                    accountRepository
                        .findAllByOrganization(organizationId)
                        .map { PublicAccount.from(it) }
                )
            }

            post(
                builder = {
                    description = "Create a new account"
                    tags = listOf("account")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the accounts"
                            required = true
                        }
                        body<CreateAccount> {
                            description = "new account"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.Created) {
                            description = "account"
                            body<PublicAccount>()
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayWriteOrganization()
                val createAccount = call.receive<CreateAccount>()

                val account = accountRepository.createAccount(
                    createAccount = createAccount,
                    organizationId = organizationId,
                )
                call.respond(
                    HttpStatusCode.Created,
                    PublicAccount.from(account)
                )
            }

            patch(
                builder = {
                    description = "Update an account"
                    tags = listOf("account")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the accounts"
                            required = true
                        }
                        body<UpdateAccount> {
                            description = "updated account"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.OK) {
                            description = "account"
                            body<PublicAccount>()
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayWriteOrganization()
                val updateAccount = call.receive<UpdateAccount>()

                val account = accountRepository.updateAccount(
                    updateAccount = updateAccount,
                    organizationId = organizationId,
                )
                call.respond(
                    HttpStatusCode.OK,
                    PublicAccount.from(account)
                )
            }

            delete(
                "/{accountId}",
                builder = {
                    description = "Delete an account"
                    tags = listOf("account")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the account"
                            required = true
                        }
                        pathParameter<String>("accountId") {
                            description = "The id of the account that is to be deleted"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.NoContent) {
                            description = "account deleted"
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayWriteOrganization()
                val accountId = call.parameters.getOrFail("accountId")

                accountRepository.deleteAccount(
                    organizationId = organizationId,
                    accountId = accountId
                )

                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}