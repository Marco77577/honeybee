import config.configureHTTP
import config.configureMonitoring
import config.configureSerialization
import config.authentication.configureAuthentication
import config.configureRouting
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
}
