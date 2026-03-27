package com.accounting.database.account

import com.accounting.database.Id
import com.accounting.database.LocalDateTimeSerializer
import com.accounting.database.category.*
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class Account(
    val id: String = Id.account(),
    val number: Int,
    val name: String,
    val description: String? = null,
    val category: String,
    val organization: String,

    @Serializable(with = LocalDateTimeSerializer::class)
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    @Serializable(with = LocalDateTimeSerializer::class)
    val createdAt: LocalDateTime = LocalDateTime.now(),
) {

    data class Builder(
        val number: Int,
        val name: String,
    ) {

        /**
         * Build the account.
         * @param organizationId The id of the organization for which the accounts are to be built.
         * @param category The category to which the account is to be added.
         */
        fun build(
            organizationId: String,
            category: Category,
        ) = Account(
            number = number,
            name = name,
            category = category.id,
            organization = organizationId,
        )
    }
}

@Serializable
data class ResolvedAccount(
    val id: String = Id.account(),
    val number: Int,
    val name: String,
    val description: String? = null,
    val category: Category,
    val mainCategory: Category,
    val organization: String,

    @Serializable(with = LocalDateTimeSerializer::class)
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    @Serializable(with = LocalDateTimeSerializer::class)
    val createdAt: LocalDateTime = LocalDateTime.now(),
) {

    val type = when (mainCategory.name) {
        ASSETS_CATEGORY_NAME -> AccountType.ASSET
        LIABILITIES_CATEGORY_NAME -> AccountType.LIABILITY_AND_EQUITY
        EXPENSE_CATEGORY_NAME -> AccountType.EXPENSE
        REVENUE_CATEGORY_NAME -> AccountType.REVENUE
        BALANCE_CATEGORY_NAME -> AccountType.BALANCE_SHEET
        else -> null
    }
}