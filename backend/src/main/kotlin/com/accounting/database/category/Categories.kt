package com.accounting.database.category

import com.accounting.database.organization.Organizations
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

object Categories : Table("categories") {
    val id = varchar("id", 255).uniqueIndex()
    val name = varchar("name", 255)
    val editable = bool("editable").default(true)
    val parent = varchar("parent_category_id", 255).references(id).nullable()
    val main = varchar("main_category_id", 255).references(id)
    val organization = varchar("organization_id", 255).references(
        ref = Organizations.id,
        onDelete = ReferenceOption.CASCADE
    )
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    override val primaryKey = PrimaryKey(id)
}