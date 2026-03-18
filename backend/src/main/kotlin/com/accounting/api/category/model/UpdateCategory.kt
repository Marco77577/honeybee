package com.accounting.api.category.model

import kotlinx.serialization.Serializable

@Serializable
data class UpdateCategory(
    val id: String,
    val name: String,
    val parent: String,
)