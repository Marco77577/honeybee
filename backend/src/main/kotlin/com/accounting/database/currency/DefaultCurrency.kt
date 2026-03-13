package com.accounting.database.currency

enum class DefaultCurrency(
    val title: String,
    val abbreviation: String,
) {
    USD("United States Dollar", "USD"),
    CHF("Swiss Franc", "CHF"),
    EUR("Euro", "EUR"),
    JPY("Japanese Yen", "JPY"),
    GBP("British Pound", "GBP"),
}