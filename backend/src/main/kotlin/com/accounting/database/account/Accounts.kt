package com.accounting.database.account

import com.accounting.database.category.Categories
import com.accounting.database.organization.Organizations
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

object Accounts : Table("accounts") {
    val id = varchar("id", 255).uniqueIndex()
    val number = integer("number")
    val name = varchar("name", 255)
    val description = text("description").nullable()
    val category = varchar("category_id", 255).references(Categories.id)
    val organization = varchar("organization_id", 255).references(Organizations.id)
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex(number, organization)
    }
}