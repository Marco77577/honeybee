package com.accounting.database.category

import com.accounting.api.category.model.CreateCategory
import com.accounting.api.category.model.UpdateCategory
import com.accounting.config.CategoryCycleException
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
        val parentCategory = Categories
            .select { Categories.id eq createCategory.parent }
            .single()
            .toCategory()

        val id = Categories.insert {
            it[id] = Id.category()
            it[name] = createCategory.name.trim()
            it[parent] = parentCategory.id
            it[main] = parentCategory.main
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
        assertNoCycle(
            categoryId = updateCategory.id,
            newParentId = updateCategory.parent
        )

        val parentCategory = Categories
            .select { Categories.id eq updateCategory.parent }
            .single()
            .toCategory()

        Categories.update(
            {
                (Categories.id eq updateCategory.id) and
                        (Categories.organization eq organizationId) and
                        (Categories.editable eq true)
            }
        ) {
            it[name] = updateCategory.name.trim()
            it[parent] = parentCategory.id
            it[main] = parentCategory.main
        }

        Categories
            .select { Categories.id eq updateCategory.id }
            .single()
            .toCategory()
    }

    /**
     * Assert that the new parent category would not create a cycle.
     * @param categoryId The id of the category that is to be updated.
     * @param newParentId The id of the new parent category.
     * @throws CategoryCycleException if the new parent category creates a cycle.
     */
    private fun assertNoCycle(
        categoryId: String,
        newParentId: String?
    ) {
        if (newParentId == null) return
        if (newParentId == categoryId) throw CategoryCycleException()

        var currentParentId: String? = newParentId

        while (currentParentId != null) {
            if (currentParentId == categoryId) throw CategoryCycleException()

            currentParentId = Categories
                .slice(Categories.parent)
                .select { Categories.id eq currentParentId }
                .singleOrNull()
                ?.get(Categories.parent)
        }
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

        // assign accounts of a category to be deleted to parent of the category
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
}

/**
 * Converts a [ResultRow] to a [Category] object.
 * @return The converted [Category] object.
 */
fun ResultRow.toCategory(alias: Alias<Categories>? = null) = Category(
    id = alias?.let { this[it[Categories.id]] } ?: this[Categories.id],
    name = alias?.let { this[it[Categories.name]] } ?: this[Categories.name],
    editable = alias?.let { this[it[Categories.editable]] } ?: this[Categories.editable],
    parent = alias?.let { this[it[Categories.parent]] } ?: this[Categories.parent],
    main = alias?.let { this[it[Categories.main]] } ?: this[Categories.main],
    organization = alias?.let { this[it[Categories.organization]] } ?: this[Categories.organization],
    updatedAt = alias?.let { this[it[Categories.updatedAt]] } ?: this[Categories.updatedAt],
    createdAt = alias?.let { this[it[Categories.createdAt]] } ?: this[Categories.createdAt],
)