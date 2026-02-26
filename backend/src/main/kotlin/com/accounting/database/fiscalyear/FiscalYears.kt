package com.accounting.database.fiscalyear

import com.accounting.database.organization.Organizations
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.datetime

object FiscalYears : Table("fiscal_year") {
    val id = varchar("id", 255).uniqueIndex()
    val start = date("start")
    val end = date("end")
    val isActive = bool("is_active")
    val organization = varchar("organization_id", 255).references(Organizations.id)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)
    override val primaryKey = PrimaryKey(id)
}