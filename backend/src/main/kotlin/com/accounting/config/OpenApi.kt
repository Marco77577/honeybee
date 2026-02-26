package com.accounting.config


import io.github.smiley4.ktoropenapi.OpenApi
import io.github.smiley4.ktoropenapi.config.OutputFormat
import io.ktor.server.application.*

fun Application.configureDocumentation() {
    install(OpenApi) {
        info {
            title = "Honeybee API"
            version = "1.0.0"
            description = "The API of the Honeybee backend."
        }
        outputFormat = OutputFormat.JSON
    }
}