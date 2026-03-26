import Heading2 from "@/app/components/title/Heading2";
import {Trash} from "lucide-react";
import SecondaryButton from "@/app/components/button/SecondaryButton";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import React, {useState} from "react";
import clsx from "clsx";
import {Organization, useDeleteOrganizationMutation} from "@/app/context/api/queries/organizations";

interface DeleteOrganizationProps {
    organization: Organization,
    onSuccess: () => void,
}

export default function DeleteOrganization({
                                               organization,
                                               onSuccess,
                                               className,
                                               ...props
                                           }: DeleteOrganizationProps & React.HTMLAttributes<HTMLDivElement>) {
    // dependencies
    const deleteOrganization = useDeleteOrganizationMutation();

    // states
    const [isServerError, setIsServerError] = useState<boolean>(false);

    const handleOrganizationDelete = () => {
        deleteOrganization.mutate(
            {organizationId: organization.id},
            {
                onSuccess: () => {
                    onSuccess();
                    setIsServerError(false);
                },
                onError: () => setIsServerError(true)
            }
        );
    }

    return (
        <div {...props}
             className={clsx(`w-full max-w-xl mx-auto flex flex-col gap-3 py-4`, className)}>
            <div className={`flex flex-col gap-1`}>
                <Heading2 title={`Delete Organization`}
                          icon={<Trash size={40} strokeWidth={1}/>}/>
                <p>Are you sure you want to delete organization <span
                    className={`font-bold`}>{organization.officialName}</span>?</p>
                <p>This cannot be undone.</p>
                {isServerError && <div className={`text-error text-end`}>Unable to delete organization.</div>}
                <div className={`flex items-center justify-end gap-3 mt-4`}>
                    <SecondaryButton title={`Delete`}
                                     loading={deleteOrganization.isPending}
                                     onClick={handleOrganizationDelete}/>
                    <PrimaryButton title={`Cancel`}
                                   onClick={onSuccess}/>
                </div>
            </div>
        </div>
    )
        ;
}