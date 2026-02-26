package com.accounting

import com.accounting.api.configureApi
import com.accounting.config.*
import com.accounting.config.authentication.OidcDiscovery
import com.accounting.config.authentication.configureAuthentication
import io.ktor.server.application.*
import io.ktor.server.netty.*

fun main(args: Array<String>) {
    EngineMain.main(args)
}

fun Application.module() {
    val oidcDiscovery = OidcDiscovery()

    configureDatabase()
    configureMonitoring()
    configureHTTP()
    configureSerialization()
    configureAuthentication(oidcDiscovery)
    configureDocumentation(oidcDiscovery)
    configureRouting()
    configureApi()
}
