package com.accounting

import com.accounting.config.configureDatabase
import com.accounting.config.configureHTTP
import com.accounting.config.configureMonitoring
import com.accounting.config.configureSerialization
import com.accounting.config.authentication.configureAuthentication
import com.accounting.config.configureRouting
import io.ktor.server.application.*
import io.ktor.server.netty.*

fun main(args: Array<String>) {
    EngineMain.main(args)
}

fun Application.module() {
    configureMonitoring()
    configureHTTP()
    configureAuthentication()
    configureSerialization()
    configureRouting()
    configureDatabase()
}
