package com.accounting.database.account

import com.accounting.database.Id
import com.accounting.database.LocalDateTimeSerializer
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class Account(
    val id: String = Id.account(),
    val number: Int,
    val name: String,
    val color: String,
    val description: String? = null,
    val category: AccountCategory,

    @Serializable(with = LocalDateTimeSerializer::class)
    val updatedAt: LocalDateTime,

    @Serializable(with = LocalDateTimeSerializer::class)
    val createdAt: LocalDateTime,
)