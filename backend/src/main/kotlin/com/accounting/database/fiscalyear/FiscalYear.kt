package com.accounting.database.fiscalyear

import com.accounting.database.Id
import com.accounting.database.LocalDateSerializer
import com.accounting.database.LocalDateTimeSerializer
import kotlinx.serialization.Serializable
import java.time.LocalDate
import java.time.LocalDateTime

@Serializable
data class FiscalYear(
    val id: String = Id.fiscalYear(),

    @Serializable(with = LocalDateSerializer::class)
    val start: LocalDate,

    @Serializable(with = LocalDateSerializer::class)
    val end: LocalDate,

    val isActive: Boolean,
    val organisation: String,

    @Serializable(with = LocalDateTimeSerializer::class)
    val updatedAt: LocalDateTime,

    @Serializable(with = LocalDateTimeSerializer::class)
    val createdAt: LocalDateTime,
)