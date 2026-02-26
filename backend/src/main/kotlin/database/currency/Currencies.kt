package database.currency

import org.jetbrains.exposed.sql.Table

object Currencies : Table("currency") {
    val id = varchar("id", 255)
    val name = varchar("name", 255)
    val abbreviation = varchar("abbreviation", 3).uniqueIndex()
    val manualExchangeRate = double("manual_exchange_rate").nullable()
    override val primaryKey = PrimaryKey(id)
}