package com.accounting.database.currency

import com.accounting.database.Id
import com.accounting.database.LocalDateTimeSerializer
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class Currency(
    val id: String = Id.currency(),
    val name: String,
    val abbreviation: String,
    val manualExchangeRate: Double? = null,
    val organization: String,

    @Serializable(with = LocalDateTimeSerializer::class)
    val updatedAt: LocalDateTime,

    @Serializable(with = LocalDateTimeSerializer::class)
    val createdAt: LocalDateTime,
)