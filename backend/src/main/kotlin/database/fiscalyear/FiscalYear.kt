package com.accounting.database.fiscalyear

import com.accounting.database.LocalDateTimeSerializer
import database.Id
import database.LocalDateSerializer
import kotlinx.serialization.Serializable
import java.time.LocalDate
import java.time.LocalDateTime

@Serializable
data class FiscalYear(
    val id: String = Id.fiscalYear(),
    val isActive: Boolean,

    @Serializable(with = LocalDateSerializer::class)
    val start: LocalDate,

    @Serializable(with = LocalDateSerializer::class)
    val end: LocalDate,

    @Serializable(with = LocalDateTimeSerializer::class)
    val updatedAt: LocalDateTime,

    @Serializable(with = LocalDateTimeSerializer::class)
    val createdAt: LocalDateTime,
)