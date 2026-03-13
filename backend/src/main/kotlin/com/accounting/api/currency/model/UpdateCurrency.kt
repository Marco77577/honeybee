package com.accounting.api.currency.model

import kotlinx.serialization.Serializable

@Serializable
data class UpdateCurrency(
    val id: String,
    val name: String,
    val abbreviation: String,
    val manualExchangeRate: Double?,
)