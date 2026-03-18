package com.accounting.database

import com.accounting.database.account.Accounts
import com.accounting.database.category.Categories
import com.accounting.database.currency.Currencies
import com.accounting.database.fiscalyear.FiscalYears
import com.accounting.database.organization.Organizations
import com.accounting.database.transaction.Transactions
import org.jetbrains.exposed.sql.Table
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
object Id {

    fun currency() = generate(Currencies)
    fun fiscalYear() = generate(FiscalYears)
    fun account() = generate(Accounts)
    fun category() = generate(Categories)
    fun transaction() = generate(Transactions)
    fun organisation() = generate(Organizations)

    /**
     * Generates a prefixed UUID.
     * @param table The table from which the prefix is derived.
     * @return The generated UUID.
     */
    private fun generate(table: Table): String {
        val prefix = table.tableName.substring(
            startIndex = 0,
            endIndex = 3.coerceAtMost(table.tableName.length)
        )
        return "${prefix}_${Uuid.generateV7()}"
    }
}