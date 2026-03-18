package com.accounting.api.category.model

import kotlinx.serialization.Serializable

@Serializable
data class CreateCategory(
    val name: String,
    val parent: String,
)