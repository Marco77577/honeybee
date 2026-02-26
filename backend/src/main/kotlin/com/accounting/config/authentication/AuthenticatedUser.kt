package com.accounting.config.authentication

/**
 * Represents an authenticated user.
 * @property id The id of the user.
 * @property email The email address of the user.
 * @property isEmailAddressVerified `true` if the email address of the user has been verified, `false` otherwise.
 * @property name The name of the user, if available.
 * @property familyName The family name of the user, if available.
 * @property givenName The given name of the user, if available.
 * @property username The username of the user, if available.
 */
data class AuthenticatedUser(
    val id: String,
    val email: String,
    val isEmailAddressVerified: Boolean,
    val name: String?,
    val familyName: String?,
    val givenName: String?,
    val username: String?,
)