"use client"

import React, {createContext, useContext, useMemo} from "react";
import {Configuration, OrganizationApi} from "@/app/generated/api";
import {useAuth} from "react-oidc-context";

interface ApiProvider {
    organizationApi: OrganizationApi
}

export const ApiContext = createContext<ApiProvider | null>(null)

export function useOrganizationApi() {
    const api = useContext(ApiContext);
    if (!api) throw new Error("api provider not initialized");
    return api.organizationApi
}

export function ApiProvider({children}: { children: React.ReactNode }) {
    const auth = useAuth();
    const value = useMemo(
        () => {
            const config = new Configuration({
                basePath: "http://localhost:8080",
                accessToken: `Bearer ${auth.user?.access_token}`,
            });
            return {
                organizationApi: new OrganizationApi(config)
            };
        },
        [auth.user?.access_token]
    );

    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    )
}
