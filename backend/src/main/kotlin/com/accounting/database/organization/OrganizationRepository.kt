package com.accounting.database.organization

import com.accounting.api.organization.model.NewOrganization
import com.accounting.database.Id
import com.accounting.database.account.AccountCategory
import com.accounting.database.account.Accounts
import com.accounting.database.currency.Currencies
import com.accounting.database.currency.DefaultCurrency
import com.accounting.database.organization.Organizations.createdAt
import com.accounting.database.organization.Organizations.defaultPaymentAccount
import com.accounting.database.organization.Organizations.defaultRevenueAccount
import com.accounting.database.organization.Organizations.displayName
import com.accounting.database.organization.Organizations.id
import com.accounting.database.organization.Organizations.legalForm
import com.accounting.database.organization.Organizations.mainCurrency
import com.accounting.database.organization.Organizations.officialName
import com.accounting.database.organization.Organizations.updatedAt
import com.accounting.database.user.User
import com.accounting.database.user.Users
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

/**
 * Repository class for accessing and manipulating [Organization]s.
 */
class OrganizationRepository {

    /**
     * Finds all [Organization]s a [User] is part of.
     * @param userId The ID of the [User] whose [Organization]s are to be retrieved.
     * @return A list of [Organization]s.
     */
    fun findByUser(userId: String) = transaction {
        Users
            .join(
                otherTable = Organizations,
                joinType = JoinType.INNER,
                onColumn = Users.organisation,
                otherColumn = Organizations.id
            )
            .select { Users.user eq userId }
            .map {
                it.toOrganization()
            }
    }

    fun createOrganization(newOrganization: NewOrganization) = transaction {
        val id = Organizations
            .insert {
                it[id] = Id.organisation()
                it[displayName] = newOrganization.displayName
                it[officialName] = newOrganization.displayName
                it[legalForm] = newOrganization.legalForm
            } get Organizations.id

        DefaultCurrency.entries
            .filterNot { it == DefaultCurrency.USD }
            .forEach { currency ->
                Currencies
                    .insert {
                        it[Currencies.id] = Id.currency()
                        it[Currencies.name] = currency.title
                        it[Currencies.abbreviation] = currency.abbreviation
                        it[Currencies.manualExchangeRate] = null
                        it[Currencies.organization] = id
                    }
            }

        val mainCurrencyId = Currencies
            .insert {
                it[Currencies.id] = Id.currency()
                it[Currencies.name] = DefaultCurrency.USD.title
                it[Currencies.abbreviation] = DefaultCurrency.USD.abbreviation
                it[Currencies.manualExchangeRate] = null
                it[Currencies.organization] = id
            } get Currencies.id

        val defaultPaymentAccountId = Accounts
            .insert {
                it[Accounts.id] = Id.account()
                it[Accounts.number] = 1020
                it[Accounts.name] = "Bank"
                it[Accounts.color] = "ff00ff"
                it[Accounts.category] = AccountCategory.BANK_ACCOUNT
                it[Accounts.organization] = id

            } get Accounts.id

        val defaultRevenueAccountId = Accounts
            .insert {
                it[Accounts.id] = Id.account()
                it[Accounts.number] = 3200
                it[Accounts.name] = "Gross Revenues"
                it[Accounts.color] = "00ff00"
                it[Accounts.category] = AccountCategory.SERVICE_REVENUE
                it[Accounts.organization] = id

            } get Accounts.id

        Organizations.update({ Organizations.id eq id }) {
            it[mainCurrency] = mainCurrencyId
            it[defaultPaymentAccount] = defaultPaymentAccountId
            it[defaultRevenueAccount] = defaultRevenueAccountId
        }

        Organizations
            .select { Organizations.id eq id }
            .single()
            .toOrganization()
    }

    /**
     * Converts a [ResultRow] to a [Organization] object.
     * @return The converted [Organization] object.
     */
    private fun ResultRow.toOrganization() = Organization(
        id = this[id],
        displayName = this[displayName],
        officialName = this[officialName],
        legalForm = this[legalForm],
        defaultPaymentAccount = this[defaultPaymentAccount],
        defaultRevenueAccount = this[defaultRevenueAccount],
        mainCurrency = this[mainCurrency],
        updatedAt = this[updatedAt],
        createdAt = this[createdAt]
    )
}