import React, {useState} from "react";
import {Category} from "@/app/context/api/queries/categories";
import clsx from "clsx";
import {Folder, FolderOpen, FolderPen, FolderPlus, PanelLeftClose, Trash} from "lucide-react";
import {AutoHeight} from "@/app/components/AutoHeight";
import ClickableIcon from "@/app/components/ClickableIcon";
import UpsertCategory from "@/app/account/UpsertCategory";
import {Dialog, DialogContext} from "@/app/components/Dialog";
import DeleteCategory from "@/app/account/DeleteCategory";

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
    const [open, setOpen] = useState(new Set(
        categories
            .filter(category => category.parent == null)
            .map(category => category.id)
    ))

    const closeChildren = (open: Set<string>, category: Category) => {
        childrenOf(category).forEach(child => {
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
    }

    const childrenOf = (category?: Category) => {
        return categories.filter(c => c.parent === category?.id);
    }

    const hasChildren = (category: Category) => {
        return childrenOf(category).length > 0;
    }

    const parentOf = (category: Category) => {
        return categories.find(c => c.id === category.parent);
    }

    const levelOf = (category: Category) => {
        let level = 0;
        let current: Category | undefined = category;
        while (current !== undefined) {
            level++;
            current = parentOf(current);
        }
        return level;
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
                    <AutoHeight key={category.id}
                                open={open.has(category.id) || (category.parent != null && open.has(category.parent))}>
                        <div onClick={() => toggleOpen(category)}
                             className={`relative flex items-center gap-6 py-2.5 px-3 rounded-lg hover:bg-popover-element-hover cursor-pointer hover:**:data-options:opacity-100`}
                             style={{paddingLeft: `${10 * levelOf(category)}px`}}>
                            <div className={`flex items-center gap-2 py-1`}>
                                {(open.has(category.id) && hasChildren(category)) &&
                                    <FolderOpen size={20} strokeWidth={1}/>}
                                {(!open.has(category.id) || !hasChildren(category)) &&
                                    <Folder size={20} strokeWidth={1}/>}
                                <span className={`whitespace-nowrap truncate max-w-37.5`}
                                      title={category.name}>{category.name}</span>
                            </div>
                            {!category.parent && <div
                                className={`absolute top-0 right-2 bottom-0 flex items-center rounded-lg`}>
                                <ClickableIcon
                                    title={`Close Category Panel`}
                                    onClick={onCollapsePanel}>
                                    <PanelLeftClose size={20} strokeWidth={1}/>
                                </ClickableIcon>
                            </div>}
                            {category.parent && <div
                                className={clsx(`absolute top-0 right-2 bottom-0 bg-popover-element-hover flex items-center rounded-lg opacity-0 focus-within:opacity-100`)}
                                data-options>
                                {category.editable && <Dialog>
                                    <Dialog.Trigger>
                                        <ClickableIcon title={`Edit Category`}>
                                            <FolderPen size={20} strokeWidth={1}/>
                                        </ClickableIcon>
                                    </Dialog.Trigger>
                                    <Dialog.Content>
                                        <DialogContext.Consumer>
                                            {({close}) => (
                                                <UpsertCategory
                                                    edit={category}
                                                    parent={category.parent == null ? undefined : category.parent}
                                                    onSuccess={close}
                                                />
                                            )}
                                        </DialogContext.Consumer>
                                    </Dialog.Content>
                                </Dialog>}
                                {category.parent && <Dialog>
                                    <Dialog.Trigger>
                                        <ClickableIcon title={`Add Category`}>
                                            <FolderPlus size={20} strokeWidth={1}/>
                                        </ClickableIcon>
                                    </Dialog.Trigger>
                                    <Dialog.Content>
                                        <DialogContext.Consumer>
                                            {({close}) => (
                                                <UpsertCategory
                                                    parent={category.id}
                                                    onSuccess={close}
                                                />
                                            )}
                                        </DialogContext.Consumer>
                                    </Dialog.Content>
                                </Dialog>}
                                {category.editable && <Dialog>
                                    <Dialog.Trigger>
                                        <ClickableIcon title={`Delete Category`}>
                                            <Trash size={20} strokeWidth={1}/>
                                        </ClickableIcon>
                                    </Dialog.Trigger>
                                    <Dialog.Content>
                                        <DialogContext.Consumer>
                                            {({close}) => (
                                                <DeleteCategory
                                                    category={category}
                                                    onSuccess={close}
                                                />
                                            )}
                                        </DialogContext.Consumer>
                                    </Dialog.Content>
                                </Dialog>}
                            </div>}
                        </div>
                    </AutoHeight>
                ))
            }
        </div>
    )
}