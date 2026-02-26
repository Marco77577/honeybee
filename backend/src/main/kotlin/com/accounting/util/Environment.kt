package com.accounting.util

fun isProduction() = System.getenv("KTOR_ENV") == "production"