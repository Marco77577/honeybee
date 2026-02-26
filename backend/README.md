# honeybee

## Authentication

The server uses OIDC to authenticate users.

You need to provide the following environment variables:

| Variable Name    | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `OIDC_ISSUER`    | The URL to the Issuer, e.g. `https://authentik.host.com/realms/your-realm`. |
| `OIDC_CLIENT_ID` | The client id (audience), e.g. `honeybee`.                                  |
| `OIDC_REALM`     | The realm your client lives in, e.g. `users`.                               |

## Building & Running

To build or run the project, use one of the following tasks:

| Task                                    | Description                                                          |
|-----------------------------------------|----------------------------------------------------------------------|
| `./gradlew test`                        | Run the tests                                                        |
| `./gradlew build`                       | Build everything                                                     |
| `./gradlew buildFatJar`                 | Build an executable JAR of the server with all dependencies included |
| `./gradlew buildImage`                  | Build the docker image to use with the fat JAR                       |
| `./gradlew publishImageToLocalRegistry` | Publish the docker image locally                                     |
| `./gradlew run`                         | Run the server                                                       |
| `./gradlew runDocker`                   | Run using the local docker image                                     |

If the server starts successfully, you'll see the following output:

```
2024-12-04 14:32:45.584 [main] INFO  Application - Application started in 0.303 seconds.
2024-12-04 14:32:45.682 [main] INFO  Application - Responding at http://0.0.0.0:8080
```

