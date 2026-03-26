import Heading2 from "@/app/components/title/Heading2";
import {Trash} from "lucide-react";
import SecondaryButton from "@/app/components/button/SecondaryButton";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import React, {useState} from "react";
import {Category, useDeleteCategoryMutation} from "@/app/context/api/queries/categories";
import clsx from "clsx";
import {useOrganization} from "@/app/context/OrganizationProvider";

interface DeleteCategoryProps {
    category: Category,
    onSuccess: () => void,
}

export default function DeleteCategory({
                                           category,
                                           onSuccess,
                                           className,
                                           ...props
                                       }: DeleteCategoryProps & React.HTMLAttributes<HTMLDivElement>) {
    // dependencies
    const organization = useOrganization();
    const deleteCategory = useDeleteCategoryMutation();

    // states
    const [isServerError, setIsServerError] = useState<boolean>(false);

    const handleCategoryDelete = () => {
        const organizationId = organization?.id;
        if (organizationId == null) {
            setIsServerError(true);
            return;
        }

        deleteCategory.mutate(
            {
                organizationId,
                categoryId: category.id
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
                <Heading2 title={`Delete Category`}
                          icon={<Trash size={40} strokeWidth={1}/>}/>
                <p>Are you sure you want to delete category <span className={`font-bold`}>{category.name}</span>?</p>
                <p>This cannot be undone.</p>
                {isServerError && <div className={`text-error text-end`}>Unable to delete category.</div>}
                <div className={`flex items-center justify-end gap-3 mt-4`}>
                    <SecondaryButton title={`Delete`}
                                     loading={deleteCategory.isPending}
                                     onClick={handleCategoryDelete}/>
                    <PrimaryButton title={`Cancel`}
                                   onClick={onSuccess}/>
                </div>
            </div>
        </div>
    );
}