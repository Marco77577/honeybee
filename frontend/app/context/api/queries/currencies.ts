"use client"

import {
    ApiV1CurrencyOrganizationIdCurrencyIdDeleteRequest,
    ApiV1CurrencyOrganizationIdPatchRequest,
    ApiV1CurrencyOrganizationIdPostRequest,
    ComAccountingApiCurrencyModelPublicCurrency,
    CurrencyApi
} from "@/app/generated/api";
import {mutationOptions, queryOptions, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useCurrencyApi} from "@/app/context/api/ApiProvider";
import {useOrganization} from "@/app/context/OrganizationProvider";
import {useEffect, useMemo} from "react";
import {frankfurterKeys} from "@/app/context/api/queries/frankfurter";

export type Currency = ComAccountingApiCurrencyModelPublicCurrency;

export const currencyKeys = {
    all: ["currencies"] as const,
};

export const currency = {
    queries: {
        all: (api: CurrencyApi, organizationId: string | undefined) => queryOptions({
            queryKey: [...currencyKeys.all, organizationId],
            queryFn: ({signal}: {
                signal: AbortSignal
            }) => api.apiV1CurrencyOrganizationIdGet({organizationId: organizationId!}, {signal}),
            enabled: organizationId !== undefined,
        }),
    },
    mutations: {
        create: (api: CurrencyApi) => mutationOptions({
            mutationFn: (currency: ApiV1CurrencyOrganizationIdPostRequest) => api.apiV1CurrencyOrganizationIdPost(
                currency
            ),
        }),
        update: (api: CurrencyApi) => mutationOptions({
            mutationFn: (currency: ApiV1CurrencyOrganizationIdPatchRequest) => api.apiV1CurrencyOrganizationIdPatch(
                currency
            ),
        }),
        delete: (api: CurrencyApi) => mutationOptions({
            mutationFn: (currency: ApiV1CurrencyOrganizationIdCurrencyIdDeleteRequest) => api.apiV1CurrencyOrganizationIdCurrencyIdDelete(
                currency
            ),
        }),
    },
};

export function useCurrenciesQuery() {
    const api = useCurrencyApi();
    const organization = useOrganization()
    return useQuery(currency.queries.all(api, organization?.id));
}

export function useMainCurrency() {
    const organization = useOrganization();
    const queryClient = useQueryClient();
    const {data: currencies} = useCurrenciesQuery();

    const mainCurrency = useMemo(
        () => currencies?.find(
            currency => currency.id === organization?.mainCurrencyId
        ) ?? null,
        [organization, currencies]
    );

    useEffect(() => {
        if (mainCurrency != null) queryClient.invalidateQueries({queryKey: frankfurterKeys.latest}).then();
    }, [mainCurrency, queryClient]);

    return {
        currencies,
        mainCurrency
    };
}

export function useCreateCurrencyMutation() {
    const queryClient = useQueryClient();
    const api = useCurrencyApi();
    return useMutation({
        ...currency.mutations.create(api),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: currencyKeys.all,
        }),
    })
}

export function useUpdateCurrencyMutation() {
    const queryClient = useQueryClient();
    const api = useCurrencyApi();
    return useMutation({
        ...currency.mutations.update(api),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: currencyKeys.all,
        }),
    })
}

export function useDeleteCurrencyMutation() {
    const queryClient = useQueryClient();
    const api = useCurrencyApi();
    return useMutation({
        ...currency.mutations.delete(api),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: currencyKeys.all,
        }),
    })
}