package com.accounting.database.organization

import com.accounting.database.Id
import com.accounting.database.LocalDateTimeSerializer
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class Organization(
    val id: String = Id.organisation(),
    val displayName: String,
    val officialName: String,
    val legalForm: LegalForm,
    val defaultPaymentAccount: String?,
    val defaultRevenueAccount: String?,
    val mainCurrency: String?,

    @Serializable(with = LocalDateTimeSerializer::class)
    val updatedAt: LocalDateTime,

    @Serializable(with = LocalDateTimeSerializer::class)
    val createdAt: LocalDateTime,
)