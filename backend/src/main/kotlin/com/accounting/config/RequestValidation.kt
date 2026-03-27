package com.accounting.config

import com.accounting.api.account.model.CreateAccount
import com.accounting.api.account.model.UpdateAccount
import com.accounting.api.category.model.CreateCategory
import com.accounting.api.category.model.UpdateCategory
import com.accounting.api.currency.model.CreateCurrency
import com.accounting.api.currency.model.UpdateCurrency
import com.accounting.api.organization.model.CreateOrganization
import com.accounting.api.organization.model.UpdateOrganization
import com.accounting.api.transaction.model.CreateTransaction
import com.accounting.api.transaction.model.UpdateTransaction
import io.ktor.server.application.*
import io.ktor.server.plugins.requestvalidation.*
import java.time.LocalDate

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
            if (it.id.isEmpty()) ValidationResult.Invalid("id must not be empty")
            else if (it.displayName.isEmpty()) ValidationResult.Invalid("display name must not be empty")
            else if (it.officialName.isEmpty()) ValidationResult.Invalid("official name must not be empty")
            else if (it.defaultPaymentAccount == null) ValidationResult.Invalid("default payment account must be set")
            else if (it.defaultRevenueAccount == null) ValidationResult.Invalid("default revenue account must be set")
            else ValidationResult.Valid
        }
        validate<CreateTransaction> {
            if (it.date.isEmpty()) ValidationResult.Invalid("date must not be empty")
            else if (it.title.isEmpty()) ValidationResult.Invalid("title must not be empty")
            else if (it.amount <= 0) ValidationResult.Invalid("amount must be positive")
            else if (it.currency.isEmpty()) ValidationResult.Invalid("currency must not be empty")
            else if (it.exchangeRate <= 0) ValidationResult.Invalid("exchange rate must be positive")
            else if (it.debitAccount.isEmpty()) ValidationResult.Invalid("debit account must not be empty")
            else if (it.creditAccount.isEmpty()) ValidationResult.Invalid("credit account must not be empty")
            else {
                try {
                    LocalDate.parse(it.date)
                    ValidationResult.Valid
                } catch (_: Exception) {
                    ValidationResult.Invalid("date must be in format YYYY-MM-DD")
                }
            }
        }
        validate<UpdateTransaction> {
            if (it.id.isEmpty()) ValidationResult.Invalid("id must not be empty")
            else if (it.date.isEmpty()) ValidationResult.Invalid("date must not be empty")
            else if (it.title.isEmpty()) ValidationResult.Invalid("title must not be empty")
            else if (it.amount <= 0) ValidationResult.Invalid("amount must be positive")
            else if (it.currency.isEmpty()) ValidationResult.Invalid("currency must not be empty")
            else if (it.exchangeRate <= 0) ValidationResult.Invalid("exchange rate must be positive")
            else if (it.debitAccount.isEmpty()) ValidationResult.Invalid("debit account must not be empty")
            else if (it.creditAccount.isEmpty()) ValidationResult.Invalid("credit account must not be empty")
            else {
                try {
                    LocalDate.parse(it.date)
                    ValidationResult.Valid
                } catch (_: Exception) {
                    ValidationResult.Invalid("date must be in format YYYY-MM-DD")
                }
            }
        }
    }
}