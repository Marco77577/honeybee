package com.accounting.database.currency

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

class CurrencyRepository {

    fun create(currency: Currency): Currency = transaction {
        val id = Currencies.insert {
            it[id] = currency.id
            it[name] = currency.name
            it[abbreviation] = currency.abbreviation
            it[manualExchangeRate] = currency.manualExchangeRate
        } get Currencies.id
        currency.copy(id = id)
    }

    fun findAll(): List<Currency> = transaction {
        Currencies
            .selectAll()
            .map { it.toCurrency() }
    }

    fun findById(id: String): Currency? = transaction {
        Currencies
            .select { Currencies.id eq id }
            .singleOrNull()
            ?.toCurrency()
    }

    fun delete(id: String): Boolean = transaction {
        Currencies.deleteWhere { Currencies.id eq id } > 0
    }

    /**
     * Converts a [ResultRow] to a [Currency] object.
     * @return The converted [Currency] object.
     */
    private fun ResultRow.toCurrency() = Currency(
        id = this[Currencies.id],
        name = this[Currencies.name],
        abbreviation = this[Currencies.abbreviation],
        manualExchangeRate = this[Currencies.manualExchangeRate],
        updatedAt = this[Currencies.updatedAt],
        createdAt = this[Currencies.createdAt],
    )
}