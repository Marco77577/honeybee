import {OrganizationApi} from "@/app/generated/api";
import {useOrganizationApi} from "@/app/context/api/ApiProvider";
import {useQuery} from "@tanstack/react-query";

export const organizationQueries = {
    all: (api: OrganizationApi) => ({
        queryKey: ["organizations"],
        queryFn: ({signal}: { signal: AbortSignal }) => api.apiV1OrganizationGet({signal}),
    })
};

export function useOrganizationsQuery() {
    const api = useOrganizationApi();
    return useQuery(organizationQueries.all(api));
}
