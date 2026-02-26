package com.accounting.config

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import database.currency.Currencies
import io.ktor.server.application.Application
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

fun Application.configureDatabase() {
    val host = System.getenv("DB_HOST") ?: error("DB_HOST environment variable is not set")
    val port = System.getenv("DB_PORT") ?: 5432
    val database = System.getenv("DB_NAME") ?: error("DB_NAME environment variable is not set")
    val username = System.getenv("DB_USERNAME") ?: error("DB_USERNAME environment variable is not set")
    val password = System.getenv("DB_PASSWORD") ?: error("DB_PASSWORD environment variable is not set")

    val config = HikariConfig().apply {
        this.jdbcUrl = "jdbc:postgresql://$host:$port/$database"
        this.driverClassName = "org.postgresql.Driver"
        this.username = username
        this.password = password
        this.maximumPoolSize = 10
    }

    val dataSource = HikariDataSource(config)
    Database.connect(dataSource)

    // Create tables
    transaction {
        SchemaUtils.createMissingTablesAndColumns(Currencies)
    }
}