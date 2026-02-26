package com.accounting.database.transaction

import com.accounting.database.account.Accounts
import com.accounting.database.organization.Organizations
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.datetime

object Transactions : Table("transactions") {
    val id = varchar("id", 255).uniqueIndex()
    val date = date("date")
    val title = varchar("title", 255)
    val amount = decimal("amount", 19, 2)
    val debitAccount = varchar("debit_account_id", 255).references(Accounts.id)
    val creditAccount = varchar("credit_account_id", 255).references(Accounts.id)
    val organization = varchar("organization_id", 255).references(Organizations.id)
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    override val primaryKey = PrimaryKey(id)
}