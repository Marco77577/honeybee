package com.accounting

import com.accounting.api.configureApi
import com.accounting.config.*
import com.accounting.config.authentication.configureAuthentication
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
    configureApi()
    configureDatabase()
}
