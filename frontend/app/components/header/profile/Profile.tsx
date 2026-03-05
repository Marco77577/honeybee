import {useAuth} from "react-oidc-context";
import React from "react";
import {Building2, LogOut, Pencil} from "lucide-react";
import PopoverListElement from "@/app/components/header/profile/PopoverListElement";
import PopoverDivider from "@/app/components/header/profile/PopoverDivider";
import ProfileTrigger from "@/app/components/header/profile/ProfileTrigger";
import {Popover} from "@/app/components/header/profile/Popover";
import {Box, Skeleton} from "@radix-ui/themes";
import {useOrganizationsQuery} from "@/app/context/api/queries/organizations";

interface ProfileProps {
    alwaysOpen?: boolean;
}

export default function Profile({alwaysOpen = false}: ProfileProps) {
    const auth = useAuth();
    const {data: organizations, isLoading} = useOrganizationsQuery()

    return (
        <Popover trigger={<ProfileTrigger/>} alwaysOpen={alwaysOpen}>
            {isLoading && (
                <div className={`contents`}>
                    <Skeleton>
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