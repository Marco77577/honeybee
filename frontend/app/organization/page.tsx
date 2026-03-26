"use client"

import Heading1 from "@/app/components/title/Heading1";
import {Building2, Pencil, Trash} from "lucide-react";
import {Skeleton} from "@radix-ui/themes";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import React from "react";
import ClickableIcon from "@/app/components/ClickableIcon";
import {Dialog, DialogContext} from "@/app/components/Dialog";
import {useOrganizationsQuery} from "@/app/context/api/queries/organizations";
import UpdateOrganization from "@/app/organization/UpdateOrganization";
import DeleteOrganization from "@/app/organization/DeleteOrganization";
import {useRouter} from "next/navigation";

function LoadingOrganization() {
    return (
        <div
            className={`grid grid-cols-subgrid col-span-3 items-center py-2.5 px-3 rounded-lg hover:bg-popover-element-hover`}>
            <div><Skeleton>Company Name</Skeleton></div>
            <div><Skeleton><ClickableIcon><Pencil size={20}/></ClickableIcon></Skeleton></div>
            <div><Skeleton><ClickableIcon><Trash size={20}/></ClickableIcon></Skeleton></div>
        </div>
    )
}

export default function Organization() {
    const router = useRouter();
    const {data: organizations} = useOrganizationsQuery();

    return (
        <div className={`flex flex-col gap-6 py-16`}>
            <div className={`mx-auto container px-4 md:px-0 flex flex-col gap-6`}>
                <div className={`w-full max-w-xl mx-auto flex flex-col gap-6`}>
                    <Heading1 title={`Organizations`}
                              icon={<Building2 size={40} strokeWidth={1}/>}/>
                </div>
                <div className={`w-full max-w-xl mx-auto flex flex-col gap-3`}>
                    <div
                        className={`grid grid-cols-[1fr_min-content_min-content] gap-x-3 rounded-lg p-2 bg-input-text-background border border-input-text-border text-input-text-foreground outline-3 outline-transparent hover:outline-input-text-border-outline`}>
                        {
                            organizations?.map(organization => (
                                <div
                                    key={organization.id}
                                    className={`grid grid-cols-subgrid col-span-3 items-center py-2.5 px-3 rounded-lg hover:bg-popover-element-hover`}>
                                    <div>{organization.displayName}</div>
                                    <Dialog>
                                        <Dialog.Trigger tabIndex={0}>
                                            <ClickableIcon title={`Edit Organization`}>
                                                <Pencil size={20} strokeWidth={1}/>
                                            </ClickableIcon>
                                        </Dialog.Trigger>
                                        <Dialog.Content>
                                            <DialogContext.Consumer>
                                                {({close}) => (
                                                    <UpdateOrganization
                                                        organization={organization}
                                                        onSuccess={close}
                                                    />
                                                )}
                                            </DialogContext.Consumer>
                                        </Dialog.Content>
                                    </Dialog>
                                    <Dialog>
                                        <Dialog.Trigger tabIndex={0}>
                                            <ClickableIcon title={`Delete Organization`}>
                                                <Trash size={20} strokeWidth={1}/>
                                            </ClickableIcon>
                                        </Dialog.Trigger>
                                        <Dialog.Content>
                                            <DialogContext.Consumer>
                                                {({close}) => (
                                                    <DeleteOrganization
                                                        organization={organization}
                                                        onSuccess={close}
                                                    />
                                                )}
                                            </DialogContext.Consumer>
                                        </Dialog.Content>
                                    </Dialog>
                                </div>
                            )) ?? Array.from({length: 5}, (_, i) => <LoadingOrganization key={i}/>)
                        }
                    </div>
                    <div className={`flex justify-end`}>
                        <PrimaryButton
                            onClick={() => router.push(`/organization/setup`)}
                            title={`Add Organization`}/>
                    </div>
                </div>
            </div>
        </div>
    )
}