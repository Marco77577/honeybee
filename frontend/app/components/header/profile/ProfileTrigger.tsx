import React from "react";
import {useAuth} from "react-oidc-context";
import clsx from "clsx";

export default function ProfileTrigger({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
    const auth = useAuth();

    return (
        <div
            {...props}
            className={clsx(`flex items-center hover:bg-button-secondary-background-hover border border-transparent cursor-pointer rounded-md overflow-hidden`, className)}>
            <div className={`px-3 whitespace-nowrap`}>
                <span>{auth.user?.profile.name}</span>
            </div>
            <div
                className={`w-8 h-8 rounded-md flex items-center justify-center bg-button-background text-button-foreground select-none whitespace-nowrap`}>
                {
                    auth.user?.profile.name?.split(' ').map(
                        (name, index) => (
                            <span key={`profile-name-part-${index}`}>{name[0]}</span>
                        )
                    )
                }
            </div>
        </div>
    )
}