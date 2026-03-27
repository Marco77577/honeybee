package com.accounting.api.account.model

import com.accounting.database.account.Account
import com.accounting.database.account.AccountType
import com.accounting.database.account.ResolvedAccount
import kotlinx.serialization.Serializable

@Serializable
data class PublicAccount(
    val id: String,
    val number: Int,
    val name: String,
    val description: String?,
    val type: AccountType?,
    val category: String,
) {

    companion object {

        /**
         * Converts [Account] to [PublicAccount].
         */
        fun from(account: ResolvedAccount) = PublicAccount(
            id = account.id,
            number = account.number,
            name = account.name,
            description = account.description,
            type = account.type,
            category = account.category.id,
        )
    }
}
