"use client"

import React, {createContext, useContext, useMemo} from "react";
import {AccountApi, CategoryApi, Configuration, CurrencyApi, OrganizationApi} from "@/app/generated/api";
import {useAuth} from "react-oidc-context";

interface ApiProvider {
    organizationApi: OrganizationApi,
    currencyApi: CurrencyApi,
    categoryApi: CategoryApi,
    accountApi: AccountApi,
}

export const ApiContext = createContext<ApiProvider | null>(null)

export function useOrganizationApi() {
    const context = useContext(ApiContext);
    if (!context) throw new Error("api provider not initialized");
    return context.organizationApi
}

export function useCurrencyApi() {
    const context = useContext(ApiContext);
    if (!context) throw new Error("api provider not initialized");
    return context.currencyApi
}

export function useCategoryApi() {
    const context = useContext(ApiContext);
    if (!context) throw new Error("api provider not initialized");
    return context.categoryApi
}

export function useAccountApi() {
    const context = useContext(ApiContext);
    if (!context) throw new Error("api provider not initialized");
    return context.accountApi
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
                organizationApi: new OrganizationApi(config),
                currencyApi: new CurrencyApi(config),
                categoryApi: new CategoryApi(config),
                accountApi: new AccountApi(config),
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
