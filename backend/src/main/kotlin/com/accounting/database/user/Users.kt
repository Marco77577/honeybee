package com.accounting.database.user

import com.accounting.database.organization.Organizations
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

object Users : Table("users") {
    val user = varchar("user_id", 255)
    val organisation = varchar("organisation_id", 255).references(Organizations.id)
    val role = enumerationByName<UserRole>("role", 50)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)
    override val primaryKey = PrimaryKey(organisation, user)
}