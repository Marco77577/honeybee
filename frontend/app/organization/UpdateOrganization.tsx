import React, {useState} from "react";
import Heading2 from "@/app/components/title/Heading2";
import {Building2, Inbox, Scale, Tag} from "lucide-react";
import InputField from "@/app/components/form/InputField";
import Heading3 from "@/app/components/title/Heading3";
import SecondaryButton from "@/app/components/button/SecondaryButton";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import {Organization, useUpdateOrganizationMutation} from "@/app/context/api/queries/organizations";
import {ComAccountingConfigError, ResponseError} from "@/app/generated/api";
import SelectField from "@/app/components/form/SelectField";
import {Account, useAccountsQuery} from "@/app/context/api/queries/accounts";
import {Skeleton} from "@radix-ui/themes";

interface UpdateOrganizationProps {
    organization: Organization,
    onSuccess?: () => void,
}

export default function UpdateOrganization({
                                               organization,
                                               onSuccess = () => {
                                               }
                                           }: UpdateOrganizationProps & React.HTMLAttributes<HTMLDivElement>) {
    // dependencies
    const {data: accounts} = useAccountsQuery();
    const updateOrganization = useUpdateOrganizationMutation();

    // states
    const [displayName, setDisplayName] = useState<string>(organization.displayName);
    const [officialName, setOfficialName] = useState<string>(organization.officialName);
    const [defaultPaymentAccount, setDefaultPaymentAccount] = useState<string | null>(organization.defaultPaymentAccount ?? null);
    const [defaultRevenueAccount, setDefaultRevenueAccount] = useState<string | null>(organization.defaultRevenueAccount ?? null);
    const [isDisplayNameError, setIsDisplayNameError] = useState<boolean>(false);
    const [isOfficialNameError, setIsOfficialNameError] = useState<boolean>(false);
    const [isDefaultPaymentAccountError, setIsDefaultPaymentAccountError] = useState<boolean>(false);
    const [isDefaultRevenueAccountError, setIsDefaultRevenueAccountError] = useState<boolean>(false);
    const [isServerError, setIsServerError] = useState<boolean>(false);

    // effects
    const handleDisplayNameChange = (name: string) => {
        setDisplayName(name);
        setIsDisplayNameError(name.length === 0);
    }

    const handleOfficialNameChange = (name: string) => {
        setOfficialName(name);
        setIsOfficialNameError(name.length === 0);
    }

    const handleDefaultPaymentAccountChange = (account: Account) => {
        setDefaultPaymentAccount(account.id);
    }

    const handleDefaultRevenueAccountChange = (account: Account) => {
        setDefaultRevenueAccount(account.id);
    }

    const handleServerError = async (e: Error) => {
        const error = (await (e as ResponseError).response.json()) as ComAccountingConfigError;
        console.error(error);
        setIsServerError(true);
    }

    const handleReset = () => {
        setIsDisplayNameError(false);
        setIsOfficialNameError(false);
        setIsDefaultPaymentAccountError(false);
        setIsDefaultRevenueAccountError(false);
        setIsServerError(false);
        onSuccess();
    }

    const handleUpdateClick = () => {
        if (isDisplayNameError || isOfficialNameError || isDefaultPaymentAccountError || isDefaultRevenueAccountError) {
            setIsServerError(true);
            return;
        }

        updateOrganization.mutate(
            {
                id: organization.id,
                displayName,
                officialName,
                defaultPaymentAccount,
                defaultRevenueAccount,
            },
            {
                onSuccess: handleReset,
                onError: handleServerError
            }
        );
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleUpdateClick();
        }
    };

    return (
        <div className={`w-full max-w-xl mx-auto flex flex-col gap-3 py-4`} onKeyDown={handleKeyDown}>
            <div className={`flex flex-col gap-2`}>
                <Heading2 title={`Edit Organization`}
                          icon={<Building2 size={40} strokeWidth={1}/>}/>
                <InputField
                    leading={<Tag strokeWidth={1}/>}
                    placeholder={`Display Name`}
                    value={displayName}
                    onValueChange={handleDisplayNameChange}
                    error={isDisplayNameError}/>
                <InputField
                    leading={<Scale strokeWidth={1}/>}
                    placeholder={`Official Name`}
                    value={officialName}
                    onValueChange={handleOfficialNameChange}
                    error={isOfficialNameError}/>
                <Heading3 title={`Default Accounts`}/>
                {!accounts && <>
                    <Skeleton>
                        <InputField value={``} onValueChange={() => {
                        }}/>
                    </Skeleton>
                    <Skeleton>
                        <InputField value={``} onValueChange={() => {
                        }}/>
                    </Skeleton>
                </>}
                {accounts && <>
                    <SelectField
                        icon={<Inbox/>}
                        value={accounts?.find(account => account.id === defaultPaymentAccount)}
                        onValueChange={handleDefaultPaymentAccountChange}
                        toText={account => `${account.number} ${account.name}`}
                        placeholder={`Default Payment Account`}
                        options={accounts}/>
                    <SelectField
                        icon={<Inbox/>}
                        value={accounts?.find(account => account.id === defaultRevenueAccount)}
                        onValueChange={handleDefaultPaymentAccountChange}
                        toText={account => `${account.number} ${account.name}`}
                        placeholder={`Default Revenue Account`}
                        options={accounts}/>
                </>}
            </div>
            {isServerError && <div className={`text-error text-end`}>Unable to save organization.</div>}
            <div className={`flex items-center justify-end gap-3`}>
                <SecondaryButton title={`Cancel`}
                                 onClick={handleReset}/>
                <PrimaryButton title={organization ? `Save` : `Add`}
                               loading={updateOrganization.isPending}
                               disabled={isDisplayNameError || isOfficialNameError || isDefaultPaymentAccountError || isDefaultRevenueAccountError}
                               onClick={handleUpdateClick}/>
            </div>
        </div>
    )
}