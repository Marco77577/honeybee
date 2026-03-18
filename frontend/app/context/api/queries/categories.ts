"use client"

import {
    ApiV1CategoryOrganizationIdCategoryIdDeleteRequest,
    ApiV1CategoryOrganizationIdPatchRequest,
    ApiV1CategoryOrganizationIdPostRequest,
    CategoryApi,
    ComAccountingApiCategoryModelPublicCategory
} from "@/app/generated/api";
import {mutationOptions, queryOptions, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useCategoryApi} from "@/app/context/api/ApiProvider";
import {useOrganization} from "@/app/context/OrganizationProvider";

export type Category = ComAccountingApiCategoryModelPublicCategory;

export const categoryKeys = {
    all: ["categories"] as const,
};

export const category = {
    queries: {
        all: (api: CategoryApi, organizationId: string | undefined) => queryOptions({
            queryKey: [...categoryKeys.all, organizationId],
            queryFn: ({signal}: {
                signal: AbortSignal
            }) => api.apiV1CategoryOrganizationIdGet({organizationId: organizationId!}, {signal}),
            enabled: organizationId !== undefined,
        }),
    },
    mutations: {
        create: (api: CategoryApi) => mutationOptions({
            mutationFn: (category: ApiV1CategoryOrganizationIdPostRequest) => api.apiV1CategoryOrganizationIdPost(
                category
            ),
        }),
        update: (api: CategoryApi) => mutationOptions({
            mutationFn: (category: ApiV1CategoryOrganizationIdPatchRequest) => api.apiV1CategoryOrganizationIdPatch(
                category
            ),
        }),
        delete: (api: CategoryApi) => mutationOptions({
            mutationFn: (category: ApiV1CategoryOrganizationIdCategoryIdDeleteRequest) => api.apiV1CategoryOrganizationIdCategoryIdDelete(
                category
            ),
        }),
    },
};

export function useCategoriesQuery() {
    const api = useCategoryApi();
    const organization = useOrganization()
    return useQuery(category.queries.all(api, organization?.id));
}

export function useCreateCategoryMutation() {
    const queryClient = useQueryClient();
    const api = useCategoryApi();
    return useMutation({
        ...category.mutations.create(api),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: categoryKeys.all,
        }),
    })
}

export function useUpdateCategoryMutation() {
    const queryClient = useQueryClient();
    const api = useCategoryApi();
    return useMutation({
        ...category.mutations.update(api),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: categoryKeys.all,
        }),
    })
}

export function useDeleteCategoryMutation() {
    const queryClient = useQueryClient();
    const api = useCategoryApi();
    return useMutation({
        ...category.mutations.delete(api),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: categoryKeys.all,
        }),
    })
}