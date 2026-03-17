package com.accounting.database.currency

import com.accounting.api.currency.model.CreateCurrency
import com.accounting.api.currency.model.UpdateCurrency
import com.accounting.database.Id
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.math.BigDecimal

/**
 * Repository class for accessing and manipulating [Currency]s.
 */
class CurrencyRepository {

    fun findAllByOrganization(organizationId: String): List<Currency> = transaction {
        Currencies
            .select { Currencies.organization eq organizationId }
            .map { it.toCurrency() }
    }

    fun createCurrency(
        createCurrency: CreateCurrency,
        organizationId: String,
    ) = transaction {
        val id = Currencies.insert {
            it[id] = Id.currency()
            it[name] = createCurrency.name
            it[abbreviation] = createCurrency.abbreviation
            it[manualExchangeRate] = BigDecimal(createCurrency.manualExchangeRate.toString())
            it[organization] = organizationId
        } get Currencies.id

        Currencies
            .select { Currencies.id eq id }
            .single()
            .toCurrency()
    }

    fun updateCurrency(
        updateCurrency: UpdateCurrency,
        organizationId: String,
    ) = transaction {
        Currencies.update(
            { (Currencies.id eq updateCurrency.id) and (Currencies.organization eq organizationId) }
        ) {
            it[name] = updateCurrency.name
            it[abbreviation] = updateCurrency.abbreviation
            it[manualExchangeRate] = updateCurrency.manualExchangeRate?.let {
                BigDecimal(updateCurrency.manualExchangeRate.toString())
            }
        }

        Currencies
            .select { Currencies.id eq updateCurrency.id }
            .single()
            .toCurrency()
    }

    /**
     * Converts a [ResultRow] to a [Currency] object.
     * @return The converted [Currency] object.
     */
    private fun ResultRow.toCurrency() = Currency(
        id = this[Currencies.id],
        name = this[Currencies.name],
        abbreviation = this[Currencies.abbreviation],
        manualExchangeRate = this[Currencies.manualExchangeRate]?.toDouble(),
        organization = this[Currencies.organization],
        updatedAt = this[Currencies.updatedAt],
        createdAt = this[Currencies.createdAt],
    )
}