package com.accounting.api.currency.model

import com.accounting.database.currency.Currency
import kotlinx.serialization.Serializable

@Serializable
data class PublicCurrency(
    val id: String,
    val name: String,
    val abbreviation: String,
    val manualExchangeRate: Double?,
) {

    companion object {

        /**
         * Converts [Currency] to [PublicCurrency].
         */
        fun from(currency: Currency) = PublicCurrency(
            id = currency.id,
            name = currency.name,
            abbreviation = currency.abbreviation,
            manualExchangeRate = currency.manualExchangeRate,
        )
    }
}
