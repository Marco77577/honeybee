package com.accounting.api.account.model

import com.accounting.database.account.Account
import kotlinx.serialization.Serializable

@Serializable
data class PublicAccount(
    val id: String,
    val number: Int,
    val name: String,
    val description: String?,
    val category: String,
) {

    companion object {

        /**
         * Converts [Account] to [PublicAccount].
         */
        fun from(category: Account) = PublicAccount(
            id = category.id,
            number = category.number,
            name = category.name,
            description = category.description,
            category = category.category,
        )
    }
}
