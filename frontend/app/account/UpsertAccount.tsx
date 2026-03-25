import React, {useState} from "react";
import Heading2 from "@/app/components/title/Heading2";
import {BookOpen, Inbox, Tag} from "lucide-react";
import InputField from "@/app/components/form/InputField";
import SecondaryButton from "@/app/components/button/SecondaryButton";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import {ComAccountingConfigError, ResponseError} from "@/app/generated/api";
import {useOrganization} from "@/app/context/OrganizationProvider";
import {Account, useCreateAccountMutation, useUpdateAccountMutation} from "@/app/context/api/queries/accounts";

interface UpsertAccountProps {
    edit?: Account,
    category?: string,
    onSuccess?: () => void,
}

export default function UpsertAccount({
                                          edit = undefined,
                                          category = undefined,
                                          onSuccess = () => {
                                          },
                                      }: UpsertAccountProps & React.HTMLAttributes<HTMLDivElement>) {
    // dependencies
    const organization = useOrganization();
    const createAccount = useCreateAccountMutation();
    const updateAccount = useUpdateAccountMutation();

    // states
    const [number, setNumber] = useState<string>(edit ? edit.number.toString() : '');
    const [name, setName] = useState<string>(edit ? edit.name : '');
    const [description, setDescription] = useState<string>(edit?.description ? edit.description : '');
    const [isNumberError, setIsNumberError] = useState<boolean>(false);
    const [isNameError, setIsNameError] = useState<boolean>(false);
    const [isServerError, setIsServerError] = useState<boolean>(false);
    const [isDuplicateNumberError, setIsDuplicateNumberError] = useState<boolean>(false);

    const handleNumberChange = (value: string) => {
        if (value.length > 4) value = value.substring(0, 4);
        const n = value.replace(/[\D.]/g, "") as unknown as number;
        setNumber(n.toString());
        setIsNumberError(n <= 0);
    }

    const handleNameChange = (name: string) => {
        setName(name);
        setIsNameError(name.length === 0);
    }

    const handleDescriptionChange = (description: string) => {
        setDescription(description);
    }

    const handleServerError = async (e: Error) => {
        const error = (await (e as ResponseError).response.json()) as ComAccountingConfigError;
        console.error(error);

        if (error.message.includes("already exists")) {
            setIsDuplicateNumberError(true);
        } else {
            setIsServerError(true);
        }
    }

    const handleReset = () => {
        setNumber(edit ? edit.number.toString() : '');
        setName(edit ? edit.name : '');
        setDescription(edit?.description ? edit.description : '');
        setIsNumberError(false);
        setIsNameError(false);
        setIsServerError(false);
        setIsDuplicateNumberError(false);
        onSuccess();
    }

    const handleCreateClick = () => {
        const organizationId = organization?.id;
        if (organizationId == null || isNumberError || isNameError || !category) {
            setIsServerError(true);
            return;
        }

        createAccount.mutate(
            {
                organizationId,
                comAccountingApiAccountModelCreateAccount: {
                    number: parseInt(number),
                    name,
                    description,
                    category
                }
            },
            {
                onSuccess: handleReset,
                onError: handleServerError
            }
        );
    }

    const handleUpdateClick = () => {
        const organizationId = organization?.id;
        const accountId = edit?.id;
        const category = edit?.category;
        if (organizationId == null || !accountId || !category || !category || isNumberError || isNameError) {
            setIsServerError(true);
            return;
        }

        updateAccount.mutate(
            {
                organizationId,
                comAccountingApiAccountModelUpdateAccount: {
                    id: accountId,
                    number: parseInt(number),
                    name,
                    description,
                    category
                }
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
            if (edit) {
                handleUpdateClick();
            } else {
                handleCreateClick();
            }
        }
    };

    return (
        <div className={`w-full max-w-xl mx-auto flex flex-col gap-3 py-4`} onKeyDown={handleKeyDown}>
            <div className={`flex flex-col gap-1`}>
                <Heading2 title={edit ? `Edit Account` : `New Account`}
                          icon={<Inbox size={40} strokeWidth={1}/>}/>
                {!edit && <p>What account would you like to add?</p>}
                <div className={`flex flex-col gap-2`}>
                    <div className={`flex items-center gap-2`}>
                        <InputField
                            leading={<Inbox strokeWidth={1}/>}
                            placeholder={`1000`}
                            value={number}
                            className={`max-w-25`}
                            onValueChange={handleNumberChange}
                            error={isNumberError || isDuplicateNumberError}/>
                        <InputField
                            leading={<Tag strokeWidth={1}/>}
                            placeholder={`Name`}
                            value={name}
                            className={`flex-1`}
                            onValueChange={handleNameChange}
                            error={isNameError}/>
                    </div>
                    <InputField
                        leading={<BookOpen strokeWidth={1}/>}
                        placeholder={`Description (Optional)`}
                        value={description}
                        className={`flex-1`}
                        onValueChange={handleDescriptionChange}/>
                </div>
            </div>
            {isServerError && <div className={`text-error text-end`}>Unable to save account.</div>}
            {isDuplicateNumberError && <div className={`text-error text-end`}>Number already in use.</div>}
            <div className={`flex items-center justify-end gap-3`}>
                <SecondaryButton title={`Cancel`}
                                 onClick={handleReset}/>
                <PrimaryButton title={edit ? `Save` : `Add`}
                               loading={edit ? updateAccount.isPending : createAccount.isPending}
                               disabled={isNameError}
                               onClick={edit ? handleUpdateClick : handleCreateClick}/>
            </div>
        </div>
    )
}