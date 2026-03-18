package com.accounting.database.account

import com.accounting.api.account.model.CreateAccount
import com.accounting.api.account.model.UpdateAccount
import com.accounting.database.Id
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

/**
 * Repository class for accessing and manipulating [Account]s.
 */
class AccountRepository {

    fun findAllByOrganization(organizationId: String): List<Account> = transaction {
        Accounts
            .select { Accounts.organization eq organizationId }
            .map { it.toAccount() }
    }

    fun createAccount(
        createAccount: CreateAccount,
        organizationId: String,
    ) = transaction {
        val id = Accounts.insert {
            it[id] = Id.category()
            it[number] = createAccount.number
            it[name] = createAccount.name.trim()
            it[description] = createAccount.description?.trim()
            it[category] = createAccount.category
            it[organization] = organizationId
        } get Accounts.id

        Accounts
            .select { Accounts.id eq id }
            .single()
            .toAccount()
    }

    fun updateAccount(
        updateAccount: UpdateAccount,
        organizationId: String,
    ) = transaction {
        Accounts.update(
            { (Accounts.id eq updateAccount.id) and (Accounts.organization eq organizationId) }
        ) {
            it[number] = updateAccount.number
            it[name] = updateAccount.name.trim()
            it[description] = updateAccount.description?.trim()
            it[category] = updateAccount.category
        }

        Accounts
            .select { Accounts.id eq updateAccount.id }
            .single()
            .toAccount()
    }

    fun deleteAccount(organizationId: String, accountId: String) = transaction {
        Accounts.deleteWhere { (Accounts.id eq accountId) and (Accounts.organization eq organizationId) }
    }
}

/**
 * Converts a [ResultRow] to a [Account] object.
 * @return The converted [Account] object.
 */
fun ResultRow.toAccount() = Account(
    id = this[Accounts.id],
    number = this[Accounts.number],
    name = this[Accounts.name],
    description = this[Accounts.description],
    category = this[Accounts.category],
    organization = this[Accounts.organization],
    updatedAt = this[Accounts.updatedAt],
    createdAt = this[Accounts.createdAt],
)