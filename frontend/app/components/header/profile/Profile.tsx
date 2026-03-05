import {useAuth} from "react-oidc-context";
import React from "react";
import {Building2, LogOut, Pencil} from "lucide-react";
import PopoverListElement from "@/app/components/header/profile/PopoverListElement";
import PopoverDivider from "@/app/components/header/profile/PopoverDivider";
import ProfileTrigger from "@/app/components/header/profile/ProfileTrigger";
import {Popover} from "@/app/components/header/profile/Popover";

interface ProfileProps {
    alwaysOpen?: boolean;
}

export default function Profile({alwaysOpen = false}: ProfileProps) {
    const auth = useAuth();
    return (
        <Popover trigger={<ProfileTrigger/>} alwaysOpen={alwaysOpen}>
            <PopoverListElement
                title="ACME Inc."
                subtitle="GmbH"
                icon={Building2}/>
            <PopoverListElement
                title="SpaceX"
                subtitle="GmbH"
                icon={Building2}/>
            <PopoverDivider/>
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