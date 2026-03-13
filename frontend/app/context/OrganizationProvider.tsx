"use client"

import React, {createContext, useContext, useEffect, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {currencyKeys} from "@/app/context/api/queries/currencies";
import {Organization} from "@/app/context/api/queries/organizations";
import {frankfurterKeys} from "@/app/context/api/queries/frankfurter";

interface OrganizationProvider {
    organization: Organization | undefined
    setOrganization: (organization: Organization | undefined) => void
}

export const OrganizationContext = createContext<OrganizationProvider | null>(null)

export function useOrganization() {
    const context = useContext(OrganizationContext);
    if (!context) throw new Error("organization provider not initialized");
    return context.organization
}

export function useSetOrganizationId() {
    const context = useContext(OrganizationContext);
    if (!context) throw new Error("organization provider not initialized");
    return context.setOrganization
}

export function OrganizationProvider({children}: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const [organization, setOrganization] = useState<Organization | undefined>(undefined);

    useEffect(
        () => {
            queryClient.invalidateQueries({queryKey: currencyKeys.all}).then();
            queryClient.invalidateQueries({queryKey: frankfurterKeys.latest}).then();
        },
        [organization, queryClient]
    )

    return (
        <OrganizationContext.Provider value={{organization: organization, setOrganization: setOrganization}}>
            {children}
        </OrganizationContext.Provider>
    )
}
