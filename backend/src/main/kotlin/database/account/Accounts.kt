package database.account

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

object Accounts : Table("accounts") {
    val id = varchar("id", 255).uniqueIndex()
    val number = integer("number")
    val name = varchar("name", 255)
    val color = varchar("color", 6)
    val description = text("description").nullable()
    val category = enumerationByName<AccountCategory>("category", 50)
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    override val primaryKey = PrimaryKey(id)
}