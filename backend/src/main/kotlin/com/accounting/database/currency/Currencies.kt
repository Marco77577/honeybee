package com.accounting.database.currency

import com.accounting.database.organization.Organizations
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

object Currencies : Table("currency") {
    val id = varchar("id", 255).uniqueIndex()
    val name = varchar("name", 255)
    val abbreviation = varchar("abbreviation", 3)
    val manualExchangeRate = decimal("manual_exchange_rate", 19, 4).nullable()
    val organization = varchar("organization_id", 255).references(Organizations.id)
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    override val primaryKey = PrimaryKey(id)
}