package com.accounting.config

import com.accounting.api.account.model.CreateAccount
import com.accounting.api.account.model.UpdateAccount
import com.accounting.api.category.model.CreateCategory
import com.accounting.api.category.model.UpdateCategory
import com.accounting.api.currency.model.CreateCurrency
import com.accounting.api.currency.model.UpdateCurrency
import com.accounting.api.organization.model.CreateOrganization
import com.accounting.api.organization.model.UpdateOrganization
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
            if (it.id.isEmpty()) ValidationResult.Invalid("id must not be empty")
            else if (it.name.isEmpty()) ValidationResult.Invalid("name must not be empty")
            else if (it.abbreviation.isEmpty()) ValidationResult.Invalid("abbreviation must not be empty")
            else if (it.manualExchangeRate != null && it.manualExchangeRate <= 0) ValidationResult.Invalid("exchange rate must be positive")
            else ValidationResult.Valid
        }
        validate<CreateCategory> {
            if (it.name.isEmpty()) ValidationResult.Invalid("name must not be empty")
            else if (it.parent.isEmpty()) ValidationResult.Invalid("parent must not be empty")
            else ValidationResult.Valid
        }
        validate<UpdateCategory> {
            if (it.id.isEmpty()) ValidationResult.Invalid("id must not be empty")
            else if (it.name.isEmpty()) ValidationResult.Invalid("name must not be empty")
            else if (it.parent.isEmpty()) ValidationResult.Invalid("parent must not be empty")
            else ValidationResult.Valid
        }
        validate<CreateAccount> {
            if (it.name.isEmpty()) ValidationResult.Invalid("name must not be empty")
            else if (it.number < 0) ValidationResult.Invalid("number must not be positive")
            else if (it.category.isEmpty()) ValidationResult.Invalid("parent must not be empty")
            else ValidationResult.Valid
        }
        validate<UpdateAccount> {
            if (it.id.isEmpty()) ValidationResult.Invalid("id must not be empty")
            else if (it.name.isEmpty()) ValidationResult.Invalid("name must not be empty")
            else if (it.number < 0) ValidationResult.Invalid("number must not be positive")
            else if (it.category.isEmpty()) ValidationResult.Invalid("parent must not be empty")
            else ValidationResult.Valid
        }
        validate<CreateOrganization> {
            if (it.displayName.isEmpty()) ValidationResult.Invalid("name must not be empty")
            else if (it.fiscalYear < 1990) ValidationResult.Invalid("year must be after 1990")
            else ValidationResult.Valid
        }
        validate<UpdateOrganization> {
            if (it.displayName.isEmpty()) ValidationResult.Invalid("display name must not be empty")
            if (it.officialName.isEmpty()) ValidationResult.Invalid("official name must not be empty")
            else if (it.defaultPaymentAccount == null) ValidationResult.Invalid("default payment account must be set")
            else if (it.defaultRevenueAccount == null) ValidationResult.Invalid("default revenue account must be set")
            else ValidationResult.Valid
        }
    }
}