package com.accounting.database.transaction

import com.accounting.database.Id
import com.accounting.database.LocalDateSerializer
import com.accounting.database.LocalDateTimeSerializer
import kotlinx.serialization.Serializable
import java.time.LocalDate
import java.time.LocalDateTime

@Serializable
data class Transaction(
    val id: String = Id.transaction(),

    @Serializable(with = LocalDateSerializer::class)
    val date: LocalDate,

    val title: String,
    val amount: Double,
    val debitAccount: String,
    val creditAccount: String,
    val organization: String,

    @Serializable(with = LocalDateTimeSerializer::class)
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    @Serializable(with = LocalDateTimeSerializer::class)
    val createdAt: LocalDateTime = LocalDateTime.now(),
)