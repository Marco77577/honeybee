package com.accounting.api.transaction.model

import kotlinx.serialization.Serializable

@Serializable
data class CreateTransaction(
    val date: String,
    val title: String,
    val amount: Double,
    val debitAccount: String,
    val creditAccount: String,
)