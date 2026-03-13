"use client"

import React, {createContext, useContext, useState} from "react";

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
    const [organizationId, setOrganizationId] = useState<string | undefined>(undefined);

    return (
        <OrganizationContext.Provider value={{organizationId, setOrganizationId}}>
            {children}
        </OrganizationContext.Provider>
    )
}
