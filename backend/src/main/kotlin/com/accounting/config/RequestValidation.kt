package com.accounting.config

import com.accounting.api.currency.model.CreateCurrency
import com.accounting.api.currency.model.UpdateCurrency
import io.ktor.server.application.*
import io.ktor.server.plugins.requestvalidation.*

fun Application.configureRequestValidation() {
    install(RequestValidation) {
        validate<CreateCurrency> {
            if (it.name.isEmpty()) ValidationResult.Invalid("name must not be empty")
            else if (it.abbreviation.isEmpty()) ValidationResult.Invalid("abbreviation must not be empty")
            else if (it.manualExchangeRate != null && it.manualExchangeRate <= 0) ValidationResult.Invalid("exchange rate must be positive")
            else ValidationResult.Valid
        }
        validate<UpdateCurrency> {
            if (it.name.isEmpty()) ValidationResult.Invalid("name must not be empty")
            else if (it.abbreviation.isEmpty()) ValidationResult.Invalid("abbreviation must not be empty")
            else if (it.manualExchangeRate != null && it.manualExchangeRate <= 0) ValidationResult.Invalid("exchange rate must be positive")
            else ValidationResult.Valid
        }
    }
}