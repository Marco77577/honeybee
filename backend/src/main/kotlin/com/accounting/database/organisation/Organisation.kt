package com.accounting.database.organisation

import com.accounting.database.Id
import com.accounting.database.LocalDateTimeSerializer
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class Organisation(
    val id: String = Id.organisation(),
    val displayName: String,
    val officialName: String,
    val defaultPaymentAccount: String,
    val defaultRevenueAccount: String,
    val mainCurrency: String,

    @Serializable(with = LocalDateTimeSerializer::class)
    val updatedAt: LocalDateTime,

    @Serializable(with = LocalDateTimeSerializer::class)
    val createdAt: LocalDateTime,
)