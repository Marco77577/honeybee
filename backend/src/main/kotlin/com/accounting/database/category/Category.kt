package com.accounting.database.category

import com.accounting.database.Id
import com.accounting.database.LocalDateTimeSerializer
import com.accounting.database.account.Account
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class Category(
    val id: String = Id.category(),
    val name: String,
    val editable: Boolean,
    val parent: String? = null,
    val organization: String,

    @Serializable(with = LocalDateTimeSerializer::class)
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    @Serializable(with = LocalDateTimeSerializer::class)
    val createdAt: LocalDateTime = LocalDateTime.now(),
) {
    data class Builder(
        val name: String,
        val editable: Boolean = true,
        val configure: Builder.() -> Unit = { }
    ) {

        data class Recipe(
            val categories: List<Category>,
            val accounts: List<Account>,
        )

        private val subcategories = mutableListOf<Builder>()
        private val accounts = mutableListOf<Account.Builder>()

        /**
         * Set sub-categories.
         * @param builders The sub-categories that are to be configured.
         */
        fun subcategories(vararg builders: Builder) {
            subcategories.clear()
            subcategories.addAll(builders)
        }


        /**
         * Set accounts.
         * @param builders The accounts that are to be configured.
         */
        fun accounts(vararg builders: Account.Builder) {
            accounts.clear()
            accounts.addAll(builders)
        }

        /**
         * Build the categories.
         * @param organizationId The id of the organization for which the categories are to be built.
         * @param parentCategory The parent category, in case this is a sub-category.
         */
        fun build(
            organizationId: String,
            parentCategory: Category? = null,
        ): Recipe {
            configure()
            val category = Category(
                name = name,
                editable = editable,
                parent = parentCategory?.id,
                organization = organizationId,
            )
            val accounts = accounts.map {
                it.build(
                    organizationId = organizationId,
                    category = category
                )
            }

            val subRecipes = subcategories.map {
                it.build(
                    organizationId = organizationId,
                    parentCategory = category
                )
            }
            val subcategories = subRecipes.flatMap { it.categories }
            val subaccounts = subRecipes.flatMap { it.accounts }

            return Recipe(
                categories = listOf(category) + subcategories,
                accounts = accounts + subaccounts
            )
        }
    }
}