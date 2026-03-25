import Heading2 from "@/app/components/title/Heading2";
import {Trash} from "lucide-react";
import SecondaryButton from "@/app/components/button/SecondaryButton";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import React, {useState} from "react";
import clsx from "clsx";
import {useOrganization} from "@/app/context/OrganizationProvider";
import {Account, useDeleteAccountMutation} from "@/app/context/api/queries/accounts";

interface DeleteAccountProps {
    account: Account,
    onSuccess: () => void,
}

export default function DeleteAccount({
                                          account,
                                          onSuccess,
                                          className,
                                          ...props
                                      }: DeleteAccountProps & React.HTMLAttributes<HTMLDivElement>) {
    // dependencies
    const organization = useOrganization();
    const deleteAccount = useDeleteAccountMutation();

    // states
    const [isServerError, setIsServerError] = useState<boolean>(false);

    const handleAccountDelete = () => {
        const organizationId = organization?.id;
        if (organizationId == null) {
            setIsServerError(true);
            return;
        }

        deleteAccount.mutate(
            {
                organizationId,
                accountId: account.id
            },
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
                <Heading2 title={`Delete Account`}
                          icon={<Trash size={40} strokeWidth={1}/>}/>
                <p>Are you sure you want to delete account {account.name}?</p>
                <p>This cannot be undone.</p>
                {isServerError && <div className={`text-error text-end`}>Unable to delete account.</div>}
                <div className={`flex items-center justify-end gap-3`}>
                    <SecondaryButton title={`Delete`}
                                     loading={deleteAccount.isPending}
                                     onClick={handleAccountDelete}/>
                    <PrimaryButton title={`Cancel`}
                                   onClick={onSuccess}/>
                </div>
            </div>
        </div>
    );
}