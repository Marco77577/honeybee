import React, {useState} from "react";
import Heading2 from "@/app/components/title/Heading2";
import {Folder, FolderPlus} from "lucide-react";
import InputField from "@/app/components/form/InputField";
import SecondaryButton from "@/app/components/button/SecondaryButton";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import {ComAccountingConfigError, ResponseError} from "@/app/generated/api";
import {useOrganization} from "@/app/context/OrganizationProvider";
import {Category, useCreateCategoryMutation, useUpdateCategoryMutation} from "@/app/context/api/queries/categories";

interface UpsertCategoryProps {
    edit?: Category,
    parent?: string,
    onSuccess?: () => void,
}

export default function UpsertCategory({
                                           edit = undefined,
                                           parent = undefined,
                                           onSuccess = () => {},
                                       }: UpsertCategoryProps & React.HTMLAttributes<HTMLDivElement>) {
    // dependencies
    const organization = useOrganization();
    const createCategory = useCreateCategoryMutation();
    const updateCategory = useUpdateCategoryMutation();

    // states
    const [name, setName] = useState<string>(edit ? edit.name : '');
    const [isNameError, setIsNameError] = useState<boolean>(false);
    const [isServerError, setIsServerError] = useState<boolean>(false);

    const handleNameChange = (name: string) => {
        setName(name);
        setIsNameError(name.length === 0);
    }

    const handleServerError = async (e: Error) => {
        const error = (await (e as ResponseError).response.json()) as ComAccountingConfigError;
        console.error(error);
        setIsServerError(true);
    }

    const handleReset = () => {
        if (!edit) setName('');
        setIsNameError(false);
        setIsServerError(false);
        onSuccess();
    }

    const handleCreateClick = () => {
        const organizationId = organization?.id;
        if (organizationId == null || isNameError || !parent) {
            setIsServerError(true);
            return;
        }

        createCategory.mutate(
            {
                organizationId,
                comAccountingApiCategoryModelCreateCategory: {
                    name,
                    parent
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
        const categoryId = edit?.id;
        if (organizationId == null || !categoryId || !parent || isNameError) {
            setIsServerError(true);
            return;
        }

        updateCategory.mutate(
            {
                organizationId,
                comAccountingApiCategoryModelUpdateCategory: {
                    id: categoryId,
                    name,
                    parent
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
                <Heading2 title={edit ? `Edit Category` : `New Category`}
                          icon={<FolderPlus size={40} strokeWidth={1}/>}/>
                {!edit && <p>What category would you like to add?</p>}
                <InputField
                    leading={<Folder strokeWidth={1}/>}
                    placeholder={`Cash`}
                    value={name}
                    className={`flex-1`}
                    onValueChange={handleNameChange}
                    error={isNameError}/>
            </div>
            {isServerError && <div className={`text-error text-end`}>Unable to save category.</div>}
            <div className={`flex items-center justify-end gap-3`}>
                <SecondaryButton title={`Cancel`}
                                 onClick={handleReset}/>
                <PrimaryButton title={edit ? `Save` : `Add`}
                               loading={edit ? updateCategory.isPending : createCategory.isPending}
                               disabled={isNameError}
                               onClick={edit ? handleUpdateClick : handleCreateClick}/>
            </div>
        </div>
    )
}