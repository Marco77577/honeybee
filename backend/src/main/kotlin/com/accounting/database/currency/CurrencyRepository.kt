package com.accounting.database.currency

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction

/**
 * Repository class for accessing and manipulating [Currency]s.
 */
class CurrencyRepository {

    fun findAllByOrganization(organizationId: String): List<Currency> = transaction {
        Currencies
            .select { Currencies.organization eq organizationId }
            .map { it.toCurrency() }
    }

    /**
     * Converts a [ResultRow] to a [Currency] object.
     * @return The converted [Currency] object.
     */
    private fun ResultRow.toCurrency() = Currency(
        id = this[Currencies.id],
        name = this[Currencies.name],
        abbreviation = this[Currencies.abbreviation],
        manualExchangeRate = this[Currencies.manualExchangeRate].toString(),
        organization = this[Currencies.organization],
        updatedAt = this[Currencies.updatedAt],
        createdAt = this[Currencies.createdAt],
    )
}