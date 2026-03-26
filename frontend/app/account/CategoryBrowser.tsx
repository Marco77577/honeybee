import React, {useState} from "react";
import {Category} from "@/app/context/api/queries/categories";
import clsx from "clsx";
import DragAndDropCategory from "@/app/account/DragAndDropCategory";
import {childrenOf, hasChildren, levelOf} from "@/app/account/category-tree";

interface CategoryBrowserProps {
    categories: Category[],
    onCollapsePanel: () => void,
    onCategory: (category: Category) => void,
}

export default function CategoryBrowser({
                                            categories,
                                            onCollapsePanel,
                                            onCategory,
                                            className,
                                        }: CategoryBrowserProps & React.HTMLAttributes<HTMLDivElement>) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [open, setOpen] = useState(new Set(
        categories
            .filter(category => category.parent == null)
            .map(category => category.id)
    ))

    const closeChildren = (open: Set<string>, category: Category) => {
        childrenOf(category, categories).forEach(child => {
            open.delete(child.id);
            closeChildren(open, child);
        });
    }

    const toggleOpen = (category: Category) => {
        setOpen(prev => {
            const next = new Set(prev);
            if (!category.parent) return next;
            if (next.has(category.id)) {
                next.delete(category.id);
                closeChildren(next, category);
            } else {
                next.add(category.id);
            }
            return next;
        });
        onCategory(category);
        setSelectedCategory(category);
    }

    const orderCategories = (categories: Category[]) => {
        const childrenMap = new Map<string | null, Category[]>();
        for (const category of categories) {
            const parent = category.parent ?? null;
            if (!childrenMap.has(parent)) childrenMap.set(parent, []);
            childrenMap.get(parent)?.push(category);
        }

        for (const list of childrenMap.values()) {
            list.sort(
                (a, b) => a.name.localeCompare(b.name)
            );
        }

        const result: Category[] = [];

        function traverse(parent: string | null) {
            const children = childrenMap.get(parent) || [];

            for (const child of children) {
                result.push(child);
                traverse(child.id);
            }
        }

        traverse(null);
        return result;
    }

    return (
        <div className={clsx(`flex flex-col p-2 min-w-45`, className)}>
            {
                orderCategories(categories).map(category => (
                    <DragAndDropCategory
                        key={category.id}
                        categories={categories}
                        category={category}
                        open={open.has(category.id)}
                        parentOpen={category.parent != null && open.has(category.parent)}
                        onCollapsePanel={onCollapsePanel}
                        toggleOpen={toggleOpen}
                        selected={selectedCategory?.id === category.id}/>
                ))
            }
        </div>
    )
}