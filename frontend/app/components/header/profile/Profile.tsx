import {useAuth} from "react-oidc-context";
import React, {useEffect} from "react";
import {Building2, LogOut, Pencil} from "lucide-react";
import PopoverListElement from "@/app/components/header/profile/PopoverListElement";
import PopoverDivider from "@/app/components/header/profile/PopoverDivider";
import ProfileTrigger from "@/app/components/header/profile/ProfileTrigger";
import {Popover} from "@/app/components/header/profile/Popover";
import {Box, Skeleton} from "@radix-ui/themes";
import {useOrganizationsQuery} from "@/app/context/api/queries/organizations";
import {useSetOrganizationId} from "@/app/context/OrganizationProvider";

interface ProfileProps {
    alwaysOpen?: boolean;
}

export default function Profile({alwaysOpen = false}: ProfileProps) {
    const auth = useAuth();
    const {data: organizations, isLoading} = useOrganizationsQuery();
    const setOrganizationId = useSetOrganizationId();

    useEffect(
        () => setOrganizationId(organizations?.[0]?.id),
        [organizations, setOrganizationId]
    );

    return (
        <Popover trigger={<ProfileTrigger/>} alwaysOpen={alwaysOpen}>
            {isLoading && (
                <div>
                    <Skeleton className={`mx-2 rounded-lg`}>
                        <Box>
                            <div className={`m-2 h-14`}/>
                        </Box>
                    </Skeleton>
                    <PopoverDivider/>
                </div>
            )}
            {!isLoading && organizations && organizations.length > 0 && (
                <div className={`contents`}>
                    {
                        organizations.map(
                            organization => {
                                return (
                                    <PopoverListElement
                                        key={organization.id}
                                        title={organization.displayName}
                                        subtitle="GmbH"
                                        icon={Building2}
                                        onClick={() => setOrganizationId(organization.id)}/>
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