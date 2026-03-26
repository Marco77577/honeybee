"use client"

import {
    ApiV1TransactionOrganizationIdPatchRequest,
    ApiV1TransactionOrganizationIdPostRequest,
    ApiV1TransactionOrganizationIdTransactionIdDeleteRequest,
    ComAccountingApiTransactionModelPublicTransaction,
    TransactionApi
} from "@/app/generated/api";
import {mutationOptions, queryOptions, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useTransactionApi} from "@/app/context/api/ApiProvider";
import {useOrganization} from "@/app/context/OrganizationProvider";

export type Transaction = ComAccountingApiTransactionModelPublicTransaction;

export const transactionKeys = {
    all: ["transactions"] as const,
    byAccount: (organizationId: string, accountId: string) =>
        ['transactions', 'account', organizationId, accountId] as const,
    perAccountPaged: (
        organizationId: string,
        accountId: string,
        size: number,
        page: number
    ) =>
        [...transactionKeys.byAccount(organizationId, accountId), 'paged', size, page] as const,
};

export const transaction = {
    queries: {
        paged: (
            api: TransactionApi,
            organizationId: string | undefined,
            size: number,
            page: number
        ) => queryOptions({
            queryKey: [...transactionKeys.all, organizationId, size, page],
            queryFn: ({signal}: {
                signal: AbortSignal
            }) => api.apiV1TransactionOrganizationIdSizePageGet(
                {
                    organizationId: organizationId!,
                    size,
                    page
                }, {signal}
            ),
            enabled: organizationId !== undefined,
        }),
        perAccountPaged: (
            api: TransactionApi,
            organizationId: string | undefined,
            accountId: string | undefined,
            size: number,
            page: number
        ) => queryOptions({
            queryKey: organizationId && accountId
                ? transactionKeys.perAccountPaged(organizationId, accountId, size, page)
                : [...transactionKeys.all, 'disabled'],
            queryFn: ({signal}: {
                signal: AbortSignal
            }) => api.apiV1TransactionOrganizationIdAccountIdSizePageGet(
                {
                    organizationId: organizationId!,
                    accountId: accountId!,
                    size,
                    page
                }, {signal}
            ),
            enabled: organizationId !== undefined && accountId !== undefined,
        }),
    },
    mutations: {
        create: (api: TransactionApi) => mutationOptions({
            mutationFn: (transaction: ApiV1TransactionOrganizationIdPostRequest) => api.apiV1TransactionOrganizationIdPost(
                transaction
            ),
        }),
        update: (api: TransactionApi) => mutationOptions({
            mutationFn: (transaction: ApiV1TransactionOrganizationIdPatchRequest) => api.apiV1TransactionOrganizationIdPatch(
                transaction
            ),
        }),
        delete: (api: TransactionApi) => mutationOptions({
            mutationFn: (transaction: ApiV1TransactionOrganizationIdTransactionIdDeleteRequest) => api.apiV1TransactionOrganizationIdTransactionIdDelete(
                transaction
            ),
        }),
    },
};

export function useTransactionsQuery(size: number, page: number) {
    const api = useTransactionApi();
    const organization = useOrganization();
    return useQuery(transaction.queries.paged(api, organization?.id, size, page));
}

export function usePerAccountTransactionsQuery(accountId: string | undefined, size: number, page: number) {
    const api = useTransactionApi();
    const organization = useOrganization();
    return useQuery(transaction.queries.perAccountPaged(api, organization?.id, accountId, size, page));
}

export function useCreateTransactionMutation() {
    const queryClient = useQueryClient();
    const api = useTransactionApi();
    return useMutation({
        ...transaction.mutations.create(api),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: transactionKeys.all,
        }),
    })
}

export function useUpdateTransactionMutation() {
    const queryClient = useQueryClient();
    const api = useTransactionApi();
    const organization = useOrganization();
    return useMutation({
        ...transaction.mutations.update(api),
        onSuccess: (transaction) => queryClient.invalidateQueries({
            queryKey: [
                ...transactionKeys.byAccount(organization!.id, transaction.debitAccount),
                ...transactionKeys.byAccount(organization!.id, transaction.creditAccount),
            ],
        }),
    })
}

export function useDeleteTransactionMutation() {
    const queryClient = useQueryClient();
    const api = useTransactionApi();
    return useMutation({
        ...transaction.mutations.delete(api),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: transactionKeys.all,
        }),
    })
}