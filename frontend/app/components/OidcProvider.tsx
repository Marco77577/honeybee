"use client";

import {AuthProvider} from "react-oidc-context";

const oidcConfig = {
    authority: "https://keycloak.home.yuublue.com/realms/honeybee",
    client_id: "honeybee-dev",
    redirect_uri: typeof window !== "undefined" ? window.location.origin : "",
    scope: "openid profile email",
};

export default function OidcProvider({children}: { children: React.ReactNode }) {
    return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
}