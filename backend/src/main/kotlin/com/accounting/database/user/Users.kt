package com.accounting.database.user

import com.accounting.database.organization.Organizations
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

object Users : Table("users") {
    val user = varchar("user_id", 255)
    val organization = varchar("organization_id", 255).references(
        ref = Organizations.id,
        onDelete = ReferenceOption.CASCADE
    )
    val role = enumerationByName<UserRole>("role", 50)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)
    override val primaryKey = PrimaryKey(organization, user)
}