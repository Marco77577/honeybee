package com.accounting.database.transaction

import com.accounting.api.transaction.model.CreateTransaction
import com.accounting.api.transaction.model.UpdateTransaction
import com.accounting.database.Id
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.math.BigDecimal
import java.time.LocalDate

/**
 * Repository class for accessing and manipulating [Transaction]s.
 */
class TransactionRepository {

    fun findAllByOrganization(
        organizationId: String,
        size: Int,
        page: Long,
    ): List<Transaction> = transaction {
        Transactions
            .select { Transactions.organization eq organizationId }
            .limit(size, page * size)
            .orderBy(Transactions.date to SortOrder.DESC)
            .map { it.toTransaction() }
    }

    fun findAllByOrganizationAndAccount(
        organizationId: String,
        accountId: String,
        size: Int,
        page: Long,
    ): List<Transaction> = transaction {
        Transactions
            .select {
                (Transactions.organization eq organizationId) and ((Transactions.debitAccount eq accountId) or (Transactions.creditAccount eq accountId))
            }
            .limit(size, page * size)
            .orderBy(Transactions.date to SortOrder.DESC)
            .map { it.toTransaction() }
    }

    fun createTransaction(
        createTransaction: CreateTransaction,
        organizationId: String,
    ) = transaction {
        val id = Transactions.insert {
            it[id] = Id.transaction()
            it[date] = LocalDate.parse(createTransaction.date)
            it[title] = createTransaction.title.trim()
            it[amount] = BigDecimal(createTransaction.amount.toString())
            it[exchangeRate] = BigDecimal(createTransaction.exchangeRate.toString())
            it[debitAccount] = createTransaction.debitAccount
            it[creditAccount] = createTransaction.creditAccount
            it[organization] = organizationId
        } get Transactions.id

        Transactions
            .select { Transactions.id eq id }
            .single()
            .toTransaction()
    }

    fun updateTransaction(
        updateTransaction: UpdateTransaction,
        organizationId: String,
    ) = transaction {
        Transactions.update(
            { (Transactions.id eq updateTransaction.id) and (Transactions.organization eq organizationId) }
        ) {
            it[date] = LocalDate.parse(updateTransaction.date)
            it[title] = updateTransaction.title.trim()
            it[amount] = BigDecimal(updateTransaction.amount.toString())
            it[exchangeRate] = BigDecimal(updateTransaction.exchangeRate.toString())
            it[debitAccount] = updateTransaction.debitAccount
            it[creditAccount] = updateTransaction.creditAccount
        }

        Transactions
            .select { Transactions.id eq updateTransaction.id }
            .single()
            .toTransaction()
    }

    fun deleteTransaction(organizationId: String, transactionId: String) = transaction {
        Transactions.deleteWhere {
            (Transactions.id eq transactionId) and (Transactions.organization eq organizationId)
        }
    }

    /**
     * Converts a [ResultRow] to a [Transaction] object.
     * @return The converted [Transaction] object.
     */
    private fun ResultRow.toTransaction() = Transaction(
        id = this[Transactions.id],
        date = this[Transactions.date],
        title = this[Transactions.title],
        amount = this[Transactions.amount].toDouble(),
        exchangeRate = this[Transactions.exchangeRate].toDouble(),
        debitAccount = this[Transactions.debitAccount],
        creditAccount = this[Transactions.creditAccount],
        organization = this[Transactions.organization],
        updatedAt = this[Transactions.updatedAt],
        createdAt = this[Transactions.createdAt],
    )
}