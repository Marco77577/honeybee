package com.accounting

import com.accounting.config.configureHTTP
import com.accounting.config.configureMonitoring
import com.accounting.config.configureRouting
import com.accounting.config.configureSecurity
import com.accounting.config.configureSerialization
import io.ktor.server.application.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureMonitoring()
    configureHTTP()
    configureSecurity()
    configureSerialization()
    configureRouting()
}
