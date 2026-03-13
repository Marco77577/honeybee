"use client"

import React, {createContext, useContext, useEffect, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {currencyKeys} from "@/app/context/api/queries/currencies";

interface OrganizationProvider {
    organizationId: string | undefined
    setOrganizationId: (id: string | undefined) => void
}

export const OrganizationContext = createContext<OrganizationProvider | null>(null)

export function useOrganizationId() {
    const context = useContext(OrganizationContext);
    if (!context) throw new Error("organization provider not initialized");
    return context.organizationId
}

export function useSetOrganizationId() {
    const context = useContext(OrganizationContext);
    if (!context) throw new Error("organization provider not initialized");
    return context.setOrganizationId
}

export function OrganizationProvider({children}: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const [organizationId, setOrganizationId] = useState<string | undefined>(undefined);

    useEffect(
        () => {
            queryClient.invalidateQueries({
                queryKey: currencyKeys.all,
            }).then();
        },
        [organizationId, queryClient]
    )

    return (
        <OrganizationContext.Provider value={{organizationId, setOrganizationId}}>
            {children}
        </OrganizationContext.Provider>
    )
}
