package com.accounting.database.user

import com.accounting.database.LocalDateTimeSerializer
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class User(
    val id: String,
    val organisation: String,
    val role: UserRole,

    @Serializable(with = LocalDateTimeSerializer::class)
    val updatedAt: LocalDateTime,

    @Serializable(with = LocalDateTimeSerializer::class)
    val createdAt: LocalDateTime,
)