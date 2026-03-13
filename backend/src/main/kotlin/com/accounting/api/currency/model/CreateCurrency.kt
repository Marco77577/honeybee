package com.accounting.api.currency.model

import kotlinx.serialization.Serializable

@Serializable
data class CreateCurrency(
    val name: String,
    val abbreviation: String,
    val manualExchangeRate: Double?,
)