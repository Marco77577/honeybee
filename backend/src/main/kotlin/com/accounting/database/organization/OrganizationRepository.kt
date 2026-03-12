package com.accounting.database.organization

import com.accounting.api.organization.model.NewOrganization
import com.accounting.database.Id
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
import org.jetbrains.exposed.sql.JoinType
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
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
                it[legalForm] = newOrganization.legalForm
            } get Organizations.id

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