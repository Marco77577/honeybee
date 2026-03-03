package com.accounting.database.organization

import com.accounting.database.user.User
import com.accounting.database.user.Users
import org.jetbrains.exposed.sql.JoinType
import org.jetbrains.exposed.sql.ResultRow
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

    /**
     * Converts a [ResultRow] to a [Organization] object.
     * @return The converted [Organization] object.
     */
    private fun ResultRow.toOrganization() = Organization(
        id = this[Organizations.id],
        displayName = this[Organizations.displayName],
        officialName = this[Organizations.officialName],
        defaultPaymentAccount = this[Organizations.defaultPaymentAccount],
        defaultRevenueAccount = this[Organizations.defaultRevenueAccount],
        mainCurrency = this[Organizations.mainCurrency],
        updatedAt = this[Organizations.updatedAt],
        createdAt = this[Organizations.createdAt]
    )
}