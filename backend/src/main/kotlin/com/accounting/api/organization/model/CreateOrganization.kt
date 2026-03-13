package com.accounting.api.organization.model

import com.accounting.database.organization.LegalForm
import kotlinx.serialization.Serializable

@Serializable
data class CreateOrganization(
    val displayName: String,
    val legalForm: LegalForm,
    val fiscalYear: Int,
)