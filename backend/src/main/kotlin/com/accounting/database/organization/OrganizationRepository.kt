package com.accounting.database.organization

import com.accounting.api.organization.model.CreateOrganization
import com.accounting.api.organization.model.UpdateOrganization
import com.accounting.config.authentication.AuthenticatedUser
import com.accounting.database.Id
import com.accounting.database.account.Accounts
import com.accounting.database.category.Categories
import com.accounting.database.category.defaultCategories
import com.accounting.database.currency.Currencies
import com.accounting.database.currency.DefaultCurrency
import com.accounting.database.fiscalyear.FiscalYears
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
import com.accounting.database.user.UserRole
import com.accounting.database.user.Users
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate

/**
 * Repository class for accessing and manipulating [Organization]s.
 */
class OrganizationRepository {

    /**
     * Finds all [Organization]s a [User] is part of.
     * @param userId The ID of the [User] whose [Organization]s are to be retrieved.
     * @return A list of [Organization]s.
     */
    fun findAllByUser(userId: String) = transaction {
        Users
            .join(
                otherTable = Organizations,
                joinType = JoinType.INNER,
                onColumn = Users.organization,
                otherColumn = Organizations.id
            )
            .select { Users.user eq userId }
            .map {
                it.toOrganization()
            }
    }

    fun createOrganization(
        createOrganization: CreateOrganization,
        user: AuthenticatedUser,
    ) = transaction {
        val id = Organizations.insert {
            it[id] = Id.organisation()
            it[displayName] = createOrganization.displayName.trim()
            it[officialName] = createOrganization.displayName.trim()
            it[legalForm] = createOrganization.legalForm
        } get Organizations.id

        Users.insert {
            it[Users.user] = user.id
            it[Users.organization] = id
            it[Users.role] = UserRole.OWNER
        }

        DefaultCurrency.entries
            .filterNot { it == DefaultCurrency.USD }
            .forEach { currency ->
                Currencies.insert {
                    it[Currencies.id] = Id.currency()
                    it[Currencies.name] = currency.title
                    it[Currencies.abbreviation] = currency.abbreviation
                    it[Currencies.manualExchangeRate] = null
                    it[Currencies.organization] = id
                }
            }

        val mainCurrencyId = Currencies.insert {
            it[Currencies.id] = Id.currency()
            it[Currencies.name] = DefaultCurrency.USD.title
            it[Currencies.abbreviation] = DefaultCurrency.USD.abbreviation
            it[Currencies.manualExchangeRate] = null
            it[Currencies.organization] = id
        } get Currencies.id

        val recipe = defaultCategories.build(id)
        val categories = recipe.categories
        val accounts = recipe.accounts

        categories.forEach { category ->
            Categories.insert {
                it[Categories.id] = category.id
                it[name] = category.name
                it[editable] = category.editable
                it[parent] = category.parent
                it[main] = category.main
                it[organization] = category.organization
            }
        }

        accounts.forEach { account ->
            Accounts.insert {
                it[Accounts.id] = account.id
                it[number] = account.number
                it[name] = account.name
                it[category] = account.category
                it[organization] = account.organization
            }
        }

        val defaultPaymentAccount = accounts.find { it.number == 1020 }
        val defaultRevenueAccount = accounts.find { it.number == 3200 }

        Organizations.update({ Organizations.id eq id }) {
            it[mainCurrency] = mainCurrencyId
            it[this.defaultPaymentAccount] = defaultPaymentAccount?.id
            it[this.defaultRevenueAccount] = defaultRevenueAccount?.id
        }

        FiscalYears.insert {
            it[FiscalYears.id] = Id.fiscalYear()
            it[FiscalYears.start] = LocalDate.of(createOrganization.fiscalYear, 1, 1)
            it[FiscalYears.end] = LocalDate.of(createOrganization.fiscalYear, 12, 31)
            it[FiscalYears.isActive] = true
            it[FiscalYears.organization] = id
        }

        Organizations
            .select { Organizations.id eq id }
            .single()
            .toOrganization()
    }

    fun updateOrganization(updateOrganization: UpdateOrganization) = transaction {
        Organizations.update(
            { Organizations.id eq updateOrganization.id }
        ) {
            it[displayName] = updateOrganization.displayName
            it[officialName] = updateOrganization.officialName
            it[defaultPaymentAccount] = updateOrganization.defaultPaymentAccount
            it[defaultRevenueAccount] = updateOrganization.defaultRevenueAccount
        }

        Organizations
            .select { Organizations.id eq updateOrganization.id }
            .single()
            .toOrganization()
    }

    fun deleteOrganization(organizationId: String) = transaction {
        Organizations.deleteWhere { Organizations.id eq organizationId }
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