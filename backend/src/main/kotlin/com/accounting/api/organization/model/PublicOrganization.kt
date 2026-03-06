package com.accounting.api.organization.model

import com.accounting.database.organization.Organization

data class PublicOrganization(
    val id: String,
    val displayName: String,
) {

    companion object {

        /**
         * Converts [Organization] to [PublicOrganization].
         */
        fun from(organization: Organization) = PublicOrganization(
            id = organization.id,
            displayName = organization.displayName
        )
    }
}
