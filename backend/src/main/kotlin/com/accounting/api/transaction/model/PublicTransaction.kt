package com.accounting.api.transaction.model

import com.accounting.database.transaction.Transaction
import kotlinx.serialization.Serializable

@Serializable
data class PublicTransaction(
    val id: String,
    val date: String,
    val title: String,
    val amount: Double,
    val exchangeRate: Double,
    val debitAccount: String,
    val creditAccount: String,
) {

    companion object {

        /**
         * Converts [Transaction] to [PublicTransaction].
         */
        fun from(currency: Transaction) = PublicTransaction(
            id = currency.id,
            date = currency.date.toString(),
            title = currency.title,
            amount = currency.amount,
            exchangeRate = currency.exchangeRate,
            debitAccount = currency.debitAccount,
            creditAccount = currency.creditAccount,
        )
    }
}
