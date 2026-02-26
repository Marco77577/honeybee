package com.accounting.database.organization

import com.accounting.database.account.Accounts
import com.accounting.database.currency.Currencies
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

object Organizations : Table("organisations") {
    val id = varchar("id", 255).uniqueIndex()
    val displayName = varchar("display_name", 255)
    val officialName = varchar("official_name", 255)
    val defaultPaymentAccount = varchar("default_payment_account_id", 255).references(Accounts.id)
    val defaultRevenueAccount = varchar("default_revenue_account_id", 255).references(Accounts.id)
    val mainCurrency = varchar("main_currency_id", 255).references(Currencies.id)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)
    override val primaryKey = PrimaryKey(id)
}