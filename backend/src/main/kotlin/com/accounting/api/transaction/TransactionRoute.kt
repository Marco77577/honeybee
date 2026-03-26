package com.accounting.api.transaction

import com.accounting.api.transaction.model.CreateTransaction
import com.accounting.api.transaction.model.PublicTransaction
import com.accounting.api.transaction.model.UpdateTransaction
import com.accounting.config.authentication.OIDC_AUTH
import com.accounting.config.authentication.assertMayReadOrganization
import com.accounting.config.authentication.assertMayWriteOrganization
import com.accounting.database.transaction.TransactionRepository
import io.github.smiley4.ktoropenapi.*
import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.*
import org.koin.ktor.ext.inject

fun Route.transaction() {
    val transactionRepository by inject<TransactionRepository>()

    authenticate(OIDC_AUTH) {
        route("/transaction/{organizationId}", {
            securitySchemeNames(OIDC_AUTH)
        }) {
            get(
                "/{size}/{page}",
                builder = {
                    description = "Get transactions of an organization"
                    tags = listOf("transaction")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the transactions"
                            required = true
                        }
                        pathParameter<Int>("size") {
                            description = "The size of the page that is to be returned"
                            required = true
                        }
                        pathParameter<Int>("page") {
                            description = "The page that is to be returned"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.OK) {
                            description = "transactions of an organization"
                            body<List<PublicTransaction>>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayReadOrganization()
                val size = call.parameters.getOrFail("size").toInt()
                val page = call.parameters.getOrFail("page").toLong()

                call.respond(
                    transactionRepository
                        .findAllByOrganization(
                            organizationId = organizationId,
                            size = size,
                            page = page,
                        )
                        .map { PublicTransaction.from(it) }
                )
            }

            get(
                "/{accountId}/{size}/{page}",
                builder = {
                    description = "Get transactions of an organization"
                    tags = listOf("transaction")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the transactions"
                            required = true
                        }
                        pathParameter<Stringt>("accountId") {
                            description = "The id of the account whose transactions are to be returned"
                            required = true
                        }
                        pathParameter<Int>("size") {
                            description = "The size of the page that is to be returned"
                            required = true
                        }
                        pathParameter<Int>("page") {
                            description = "The page that is to be returned"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.OK) {
                            description = "transactions of an organization"
                            body<List<PublicTransaction>>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayReadOrganization()
                val accountId = call.parameters.getOrFail("accountId")
                val size = call.parameters.getOrFail("size").toInt()
                val page = call.parameters.getOrFail("page").toLong()

                call.respond(
                    transactionRepository
                        .findAllByOrganizationAndAccount(
                            organizationId = organizationId,
                            accountId = accountId,
                            size = size,
                            page = page,
                        )
                        .map { PublicTransaction.from(it) }
                )
            }

            post(
                builder = {
                    description = "Create a new transaction"
                    tags = listOf("transaction")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the transactions"
                            required = true
                        }
                        body<CreateTransaction> {
                            description = "new transaction"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.Created) {
                            description = "transaction"
                            body<PublicTransaction>()
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayWriteOrganization()
                val createTransaction = call.receive<CreateTransaction>()

                val transaction = transactionRepository.createTransaction(
                    createTransaction = createTransaction,
                    organizationId = organizationId,
                )
                call.respond(
                    HttpStatusCode.Created,
                    PublicTransaction.from(transaction)
                )
            }

            patch(
                builder = {
                    description = "Update a transaction"
                    tags = listOf("transaction")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the transactions"
                            required = true
                        }
                        body<UpdateTransaction> {
                            description = "updated transaction"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.OK) {
                            description = "transaction"
                            body<PublicTransaction>()
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayWriteOrganization()
                val updateTransaction = call.receive<UpdateTransaction>()

                val transaction = transactionRepository.updateTransaction(
                    updateTransaction = updateTransaction,
                    organizationId = organizationId,
                )
                call.respond(
                    HttpStatusCode.OK,
                    PublicTransaction.from(transaction)
                )
            }

            delete(
                "/{transactionId}",
                builder = {
                    description = "Delete a transaction"
                    tags = listOf("transaction")
                    request {
                        pathParameter<String>("organizationId") {
                            description = "The id of the organization owning the transaction"
                            required = true
                        }
                        pathParameter<String>("transactionId") {
                            description = "The id of the transaction that is to be deleted"
                            required = true
                        }
                    }
                    response {
                        code(HttpStatusCode.NoContent) {
                            description = "transaction deleted"
                        }
                        code(HttpStatusCode.BadRequest) {
                            description = "invalid request"
                            body<Error>()
                        }
                    }
                }
            ) {
                val organizationId = assertMayWriteOrganization()
                val transactionId = call.parameters.getOrFail("transactionId")

                transactionRepository.deleteTransaction(
                    organizationId = organizationId,
                    transactionId = transactionId
                )

                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}