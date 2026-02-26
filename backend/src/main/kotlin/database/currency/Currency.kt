package database.currency

import database.Id
import kotlinx.serialization.Serializable

@Serializable
data class Currency(
    val id: String = Id.currency(),
    val name: String,
    val abbreviation: String,
    val manualExchangeRate: Double? = null
)