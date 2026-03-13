package com.accounting.config.di

import com.accounting.database.currency.CurrencyRepository
import com.accounting.database.organization.OrganizationRepository
import com.accounting.database.user.UserRepository
import io.ktor.server.application.*
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

fun Application.configureKoin() {
    install(Koin) {
        slf4jLogger()
        modules(
            module {
                singleOf(::OrganizationRepository)
                singleOf(::CurrencyRepository)
                singleOf(::UserRepository)
            }
        )
    }
}