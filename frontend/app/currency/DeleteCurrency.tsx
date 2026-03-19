import Heading2 from "@/app/components/title/Heading2";
import {Trash} from "lucide-react";
import SecondaryButton from "@/app/components/button/SecondaryButton";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import React, {useState} from "react";
import clsx from "clsx";
import {useOrganization} from "@/app/context/OrganizationProvider";
import {Currency, useDeleteCurrencyMutation} from "@/app/context/api/queries/currencies";
import CurrencyAbbreviation from "@/app/currency/CurrencyAbbreviation";

interface DeleteCurrencyProps {
    currency: Currency,
    onSuccess: () => void,
}

export default function DeleteCurrency({
                                           currency,
                                           onSuccess,
                                           className,
                                           ...props
                                       }: DeleteCurrencyProps & React.HTMLAttributes<HTMLDivElement>) {
    // dependencies
    const organization = useOrganization();
    const deleteCurrency = useDeleteCurrencyMutation();

    // states
    const [isServerError, setIsServerError] = useState<boolean>(false);

    const handleCurrencyDelete = () => {
        const organizationId = organization?.id;
        if (organizationId == null) {
            setIsServerError(true);
            return;
        }

        deleteCurrency.mutate(
            {
                organizationId,
                currencyId: currency.id
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
                <Heading2 title={`Delete Currency`}
                          icon={<Trash size={40} strokeWidth={1}/>}/>
                <p>Are you sure you want to delete currency <span
                    className={`inline-flex items-center gap-2`}>
                                    <CurrencyAbbreviation
                                        abbreviation={currency?.abbreviation}/><span>{currency?.name}</span></span>?
                </p>
                <p>This cannot be undone.</p>
                {isServerError && <div className={`text-error text-end`}>Unable to delete currency.</div>}
                <div className={`flex items-center justify-end gap-3`}>
                    <SecondaryButton title={`Delete`}
                                     loading={deleteCurrency.isPending}
                                     onClick={handleCurrencyDelete}/>
                    <PrimaryButton title={`Cancel`}
                                   onClick={onSuccess}/>
                </div>
            </div>
        </div>
    );
}