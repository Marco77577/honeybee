package com.accounting.database

import com.accounting.database.account.Accounts
import com.accounting.database.currency.Currencies
import com.accounting.database.fiscalyear.FiscalYears
import org.jetbrains.exposed.sql.Table
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
object Id {

    fun currency() = generate(Currencies)
    fun fiscalYear() = generate(FiscalYears)
    fun account() = generate(Accounts)

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
        return "${prefix}_${Uuid.Companion.generateV7()}"
    }
}