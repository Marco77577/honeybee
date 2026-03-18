package com.accounting.api.account.model

import kotlinx.serialization.Serializable

@Serializable
data class UpdateAccount(
    val id: String,
    val number: Int,
    val name: String,
    val description: String?,
    val category: String,
)