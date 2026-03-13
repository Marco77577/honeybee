import {
    ComAccountingApiOrganizationModelCreateOrganization,
    ComAccountingApiOrganizationModelPublicOrganization,
    OrganizationApi
} from "@/app/generated/api";
import {useOrganizationApi} from "@/app/context/api/ApiProvider";
import {mutationOptions, queryOptions, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export type Organization = ComAccountingApiOrganizationModelPublicOrganization;

export const organizationKeys = {
    all: ["organizations"] as const,
};

export const organization = {
    queries: {
        all: (api: OrganizationApi) => queryOptions({
            queryKey: organizationKeys.all,
            queryFn: ({signal}: { signal: AbortSignal }) => api.apiV1OrganizationGet({signal}),
        }),
    },
    mutations: {
        create: (api: OrganizationApi) => mutationOptions({
            mutationFn: (organization: ComAccountingApiOrganizationModelCreateOrganization) => api.apiV1OrganizationPost(
                {comAccountingApiOrganizationModelCreateOrganization: organization}
            ),
        }),
    },
};

export function useOrganizationsQuery() {
    const api = useOrganizationApi();
    return useQuery(organization.queries.all(api));
}

export function useCreateOrganizationMutation() {
    const queryClient = useQueryClient();
    const api = useOrganizationApi();
    return useMutation({
        ...organization.mutations.create(api),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: organizationKeys.all,
        }),
    })
}
