package com.accounting.api.transaction.model

import kotlinx.serialization.Serializable

@Serializable
data class UpdateTransaction(
    val id: String,
    val date: String,
    val title: String,
    val amount: Double,
    val currency: String,
    val exchangeRate: Double,
    val debitAccount: String,
    val creditAccount: String,
)