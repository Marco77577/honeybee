"use client"

import {
    AccountApi,
    ApiV1AccountOrganizationIdAccountIdDeleteRequest,
    ApiV1AccountOrganizationIdPatchRequest,
    ApiV1AccountOrganizationIdPostRequest,
    ComAccountingApiAccountModelPublicAccount
} from "@/app/generated/api";
import {mutationOptions, queryOptions, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useAccountApi} from "@/app/context/api/ApiProvider";
import {useOrganization} from "@/app/context/OrganizationProvider";

export type Account = ComAccountingApiAccountModelPublicAccount;

export const accountKeys = {
    all: ["accounts"] as const,
};

export const account = {
    queries: {
        all: (api: AccountApi, organizationId: string | undefined) => queryOptions({
            queryKey: [...accountKeys.all, organizationId],
            queryFn: ({signal}: {
                signal: AbortSignal
            }) => api.apiV1AccountOrganizationIdGet({organizationId: organizationId!}, {signal}),
            enabled: organizationId !== undefined,
        }),
    },
    mutations: {
        create: (api: AccountApi) => mutationOptions({
            mutationFn: (account: ApiV1AccountOrganizationIdPostRequest) => api.apiV1AccountOrganizationIdPost(
                account
            ),
        }),
        update: (api: AccountApi) => mutationOptions({
            mutationFn: (account: ApiV1AccountOrganizationIdPatchRequest) => api.apiV1AccountOrganizationIdPatch(
                account
            ),
        }),
        delete: (api: AccountApi) => mutationOptions({
            mutationFn: (account: ApiV1AccountOrganizationIdAccountIdDeleteRequest) => api.apiV1AccountOrganizationIdAccountIdDelete(
                account
            ),
        }),
    },
};

export function useAccountsQuery() {
    const api = useAccountApi();
    const organization = useOrganization()
    return useQuery(account.queries.all(api, organization?.id));
}

export function useCreateAccountMutation() {
    const queryClient = useQueryClient();
    const api = useAccountApi();
    return useMutation({
        ...account.mutations.create(api),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: accountKeys.all,
        }),
    })
}

export function useUpdateAccountMutation() {
    const queryClient = useQueryClient();
    const api = useAccountApi();
    return useMutation({
        ...account.mutations.update(api),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: accountKeys.all,
        }),
    })
}

export function useDeleteAccountMutation() {
    const queryClient = useQueryClient();
    const api = useAccountApi();
    return useMutation({
        ...account.mutations.delete(api),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: accountKeys.all,
        }),
    })
}