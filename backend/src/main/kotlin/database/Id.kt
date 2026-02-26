package database

import database.currency.Currencies
import org.jetbrains.exposed.sql.Table
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
object Id {

    fun currency() = generate(Currencies)

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