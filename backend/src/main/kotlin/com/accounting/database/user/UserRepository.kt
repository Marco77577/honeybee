package com.accounting.database.user

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction

/**
 * Repository class for accessing and manipulating [User]s.
 */
class UserRepository {

    fun mayRead(userId: String, organizationId: String): Boolean = transaction {
        Users
            .select { (Users.user eq userId) and (Users.organization eq organizationId) }
            .any()
    }

    /**
     * Converts a [ResultRow] to a [User] object.
     * @return The converted [User] object.
     */
    private fun ResultRow.toUser() = User(
        id = this[Users.user],
        organization = this[Users.organization],
        role = this[Users.role],
        updatedAt = this[Users.updatedAt],
        createdAt = this[Users.createdAt],
    )
}