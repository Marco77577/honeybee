import React, {useState} from "react";
import Heading2 from "@/app/components/title/Heading2";
import {FolderTree} from "lucide-react";
import SecondaryButton from "@/app/components/button/SecondaryButton";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import {ComAccountingConfigError, ResponseError} from "@/app/generated/api";
import {useOrganization} from "@/app/context/OrganizationProvider";
import {Category, useUpdateCategoryMutation} from "@/app/context/api/queries/categories";

interface MoveCategoryProps {
    source: Category,
    target: Category,
    onSuccess?: () => void,
}

export default function MoveCategory({
                                         source,
                                         target,
                                         onSuccess = () => {
                                         },
                                     }: MoveCategoryProps & React.HTMLAttributes<HTMLDivElement>) {
    // dependencies
    const organization = useOrganization();
    const updateCategory = useUpdateCategoryMutation();

    // states
    const [isServerError, setIsServerError] = useState<boolean>(false);

    const handleServerError = async (e: Error) => {
        const error = (await (e as ResponseError).response.json()) as ComAccountingConfigError;
        console.error(error);
        setIsServerError(true);
    }

    const handleReset = () => {
        setIsServerError(false);
        onSuccess();
    }

    const handleUpdateClick = () => {
        const organizationId = organization?.id;
        if (organizationId == null) {
            setIsServerError(true);
            return;
        }

        updateCategory.mutate(
            {
                organizationId,
                comAccountingApiCategoryModelUpdateCategory: {
                    id: source.id,
                    name: source.name,
                    parent: target.id,
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
            handleUpdateClick();
        }
    };

    return (
        <div className={`w-full max-w-xl mx-auto flex flex-col gap-3 py-4`} onKeyDown={handleKeyDown}>
            <div className={`flex flex-col gap-1`}>
                <Heading2 title={`Move Category`}
                          icon={<FolderTree size={40} strokeWidth={1}/>}/>
                <p>Are you sure you want to move category <span className={`font-bold`}>{source.name}</span> and all its
                    children into category <span className={`font-bold`}>{target.name}</span>?</p>
            </div>
            {isServerError && <div className={`text-error text-end`}>Unable to save category.</div>}
            <div className={`flex items-center justify-end gap-3 mt-4`}>
                <SecondaryButton title={`Move`}
                                 loading={updateCategory.isPending}
                                 onClick={handleUpdateClick}/>
                <PrimaryButton title={`Cancel`}
                               onClick={handleReset}/>
            </div>
        </div>
    )
}