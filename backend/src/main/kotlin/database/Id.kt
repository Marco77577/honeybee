package database

import database.currency.Currencies
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
object Id {

    fun currency() = generate(Currencies.tableName)

    /**
     * Generates a prefixed UUID.
     * @param tableName The table name from which the prefix is derived.
     * @return The generated UUID.
     */
    private fun generate(tableName: String): String {
        val prefix = tableName.substring(
            startIndex = 0,
            endIndex = 3.coerceAtMost(tableName.length)
        )
        return "${prefix}_${Uuid.Companion.generateV7()}"
    }
}