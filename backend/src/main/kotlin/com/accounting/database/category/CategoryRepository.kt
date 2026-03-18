package com.accounting.database.category

import com.accounting.api.category.model.CreateCategory
import com.accounting.api.category.model.UpdateCategory
import com.accounting.database.Id
import com.accounting.database.account.Accounts
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

/**
 * Repository class for accessing and manipulating [Category]s.
 */
class CategoryRepository {

    fun findAllByOrganization(organizationId: String): List<Category> = transaction {
        Categories
            .select { Categories.organization eq organizationId }
            .map { it.toCategory() }
    }

    fun createCategory(
        createCategory: CreateCategory,
        organizationId: String,
    ) = transaction {
        val id = Categories.insert {
            it[id] = Id.category()
            it[name] = createCategory.name.trim()
            it[parent] = createCategory.parent
            it[organization] = organizationId
        } get Categories.id

        Categories
            .select { Categories.id eq id }
            .single()
            .toCategory()
    }

    fun updateCategory(
        updateCategory: UpdateCategory,
        organizationId: String,
    ) = transaction {
        Categories.update(
            {
                (Categories.id eq updateCategory.id) and
                        (Categories.organization eq organizationId) and
                        (Categories.editable eq true)
            }
        ) {
            it[name] = updateCategory.name.trim()
            it[parent] = updateCategory.parent
        }

        Categories
            .select { Categories.id eq updateCategory.id }
            .single()
            .toCategory()
    }

    fun deleteCategory(organizationId: String, categoryId: String) = transaction {
        val category = Categories
            .select {
                (Categories.id eq categoryId) and
                        (Categories.organization eq organizationId) and
                        (Categories.editable eq true)
            }
            .single()
            .toCategory()

        // assign accounts of category to be deleted to parent of category
        category.parent?.let { parent ->
            Accounts.update({ Accounts.category eq category.id }) {
                it[Accounts.category] = parent
            }
        }

        Categories.deleteWhere {
            (Categories.id eq categoryId) and
                    (Categories.organization eq organizationId) and
                    (Categories.editable eq true)
        }
    }

    /**
     * Converts a [ResultRow] to a [Category] object.
     * @return The converted [Category] object.
     */
    private fun ResultRow.toCategory() = Category(
        id = this[Categories.id],
        name = this[Categories.name],
        editable = this[Categories.editable],
        parent = this[Categories.parent],
        organization = this[Categories.organization],
        updatedAt = this[Categories.updatedAt],
        createdAt = this[Categories.createdAt],
    )
}