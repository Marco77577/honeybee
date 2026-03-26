package com.accounting.api.organization.model

import kotlinx.serialization.Serializable

@Serializable
data class UpdateOrganization(
    val id: String,
    val displayName: String,
    val officialName: String,
    val defaultPaymentAccount: String,
    val defaultRevenueAccount: String,
)