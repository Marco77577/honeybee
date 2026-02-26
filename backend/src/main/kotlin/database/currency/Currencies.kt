package database.currency

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

object Currencies : Table("currency") {
    val id = varchar("id", 255)
    val name = varchar("name", 255)
    val abbreviation = varchar("abbreviation", 3).uniqueIndex()
    val manualExchangeRate = double("manual_exchange_rate").nullable()
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    override val primaryKey = PrimaryKey(id)
}