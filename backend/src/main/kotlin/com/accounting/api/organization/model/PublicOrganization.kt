package com.accounting.api.organization.model

import com.accounting.database.organization.Organization
import kotlinx.serialization.Serializable

@Serializable
data class PublicOrganization(
    val id: String,
    val officialName: String,
    val displayName: String,
    val defaultPaymentAccount: String?,
    val defaultRevenueAccount: String?,
    val mainCurrencyId: String?,
) {

    companion object {

        /**
         * Converts [Organization] to [PublicOrganization].
         */
        fun from(organization: Organization) = PublicOrganization(
            id = organization.id,
            officialName = organization.officialName,
            displayName = organization.displayName,
            defaultPaymentAccount = organization.defaultPaymentAccount,
            defaultRevenueAccount = organization.defaultRevenueAccount,
            mainCurrencyId = organization.mainCurrency
        )
    }
}
