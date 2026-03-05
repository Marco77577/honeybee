import {useAuth} from "react-oidc-context";
import React, {useEffect, useState} from "react";
import {Building2, LogOut, Pencil} from "lucide-react";
import PopoverListElement from "@/app/components/header/profile/PopoverListElement";
import PopoverDivider from "@/app/components/header/profile/PopoverDivider";
import ProfileTrigger from "@/app/components/header/profile/ProfileTrigger";
import {Popover} from "@/app/components/header/profile/Popover";
import {ComAccountingApiUserOrganizationModelPublicOrganization} from "@/app/generated/api";
import {useOrganizationApi} from "@/app/context/api/ApiProvider";
import {Box, Skeleton} from "@radix-ui/themes";

interface ProfileProps {
    alwaysOpen?: boolean;
}

export default function Profile({alwaysOpen = false}: ProfileProps) {
    const auth = useAuth();
    const organizationApi = useOrganizationApi();
    const [organizations, setOrganizations] = useState<ComAccountingApiUserOrganizationModelPublicOrganization[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(
        () => {
            const controller = new AbortController();

            async function fetchOrganizations() {
                try {
                    setLoading(true);
                    const organizations = await organizationApi.apiV1OrganizationGet({
                        signal: controller.signal
                    });
                    setOrganizations(organizations)
                    console.log(organizations)
                } catch (e) {
                    if (e instanceof Error && e.cause.name !== "AbortError") console.error(e);
                } finally {
                    setLoading(false);
                }
            }

            fetchOrganizations().then();
            return () => controller.abort();
        },
        []
    );
    return (
        <Popover trigger={<ProfileTrigger/>} alwaysOpen={alwaysOpen}>
            {loading && (
                <div className={`contents`}>
                    <Skeleton loading={loading}>
                        <Box>
                            <PopoverListElement
                                title="ACME Inc."
                                subtitle="GmbH"
                                icon={Building2}/>
                        </Box>
                    </Skeleton>
                    <PopoverDivider/>
                </div>
            )}
            {!loading && organizations.length > 0 && (
                <div className={`contents`}>
                    {
                        organizations.map(
                            organization => {
                                return (
                                    <PopoverListElement
                                        key={organization.id}
                                        title={organization.displayName}
                                        subtitle="GmbH"
                                        icon={Building2}/>
                                )
                            }
                        )
                    }
                    <PopoverDivider/>
                </div>
            )}
            <PopoverListElement
                title="Manage Organizations"
                subtitle="Create and delete organizations."
                icon={Pencil}/>
            <PopoverDivider/>
            <PopoverListElement
                title="Logout"
                color="error"
                onClick={() => {
                    auth.removeUser().then();
                }}
                icon={LogOut}/>
        </Popover>
    )
}