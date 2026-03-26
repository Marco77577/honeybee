import React from "react";
import clsx from "clsx";
import {Folder, FolderOpen, FolderPen, FolderPlus, PanelLeftClose, Trash} from "lucide-react";
import {AutoHeight} from "@/app/components/AutoHeight";
import ClickableIcon from "@/app/components/ClickableIcon";
import {Dialog, DialogContext} from "../components/Dialog";
import UpsertCategory from "@/app/account/UpsertCategory";
import DeleteCategory from "@/app/account/DeleteCategory";
import {Category} from "@/app/context/api/queries/categories";
import {useDraggable, useDroppable} from "@dnd-kit/react";
import {allParentsOf, hasChildren, levelOf} from "@/app/account/category-tree";

interface DragAndDropCategoryProps {
    categories: Category[],
    category: Category,
    selected: boolean,
    open: boolean,
    parentOpen: boolean,
    onCollapsePanel: () => void,
    toggleOpen: (category: Category) => void,
}

export default function DragAndDropCategory({
                                                categories,
                                                category,
                                                selected,
                                                open,
                                                parentOpen,
                                                onCollapsePanel,
                                                toggleOpen
                                            }: DragAndDropCategoryProps) {
    const allParentIds = allParentsOf(category, categories).map(category => category.id);
    const {
        ref: draggableRef,
        isDragging,
    } = useDraggable({
        id: category.id,
        data: {
            type: 'category',
            category
        },
        disabled: allParentIds.length < 3
    });

    const {
        ref: droppableRef,
        isDropTarget,
    } = useDroppable({
        id: category.id,
        data: {
            type: 'category-drop',
            category
        },
        accept: (source) => {
            return !allParentIds.includes(source.data.category?.id) &&
                category.parent != null &&
                category.id !== source.data.category?.parent;
        },
    });

    return (
        <div ref={droppableRef} className={clsx(
            `rounded-lg outline-input-text-border-outline`,
            isDropTarget && `outline-3`
        )}>
            <AutoHeight open={open || parentOpen}>
                <div ref={draggableRef}>
                    <div onClick={() => toggleOpen(category)}
                         className={clsx(
                             `relative flex items-center gap-6 md:py-2.5 md:px-3 rounded-lg hover:bg-popover-element-hover cursor-pointer hover:**:data-options:opacity-100`,
                             isDragging && `scale-75 bg-popover-element-hover`,
                         )}
                         style={{paddingLeft: `${10 * levelOf(category, categories)}px`}}>
                        <div className={`w-full flex items-center gap-2 py-1`}>
                            {(open && hasChildren(category, categories)) &&
                                <FolderOpen size={20} strokeWidth={1}/>}
                            {(!open || !hasChildren(category, categories)) &&
                                <Folder size={20} strokeWidth={1}/>}
                            <span className={`whitespace-nowrap truncate max-w-37.5`}
                                  title={category.name}>{category.name}</span>
                        </div>
                        {!category.parent && <div
                            className={`absolute top-0 right-2 bottom-0 flex items-center rounded-lg`}>
                            <ClickableIcon
                                title={`Close Category Panel`}
                                onClick={e => {
                                    e.stopPropagation();
                                    onCollapsePanel();
                                }}>
                                <PanelLeftClose size={20} strokeWidth={1}/>
                            </ClickableIcon>
                        </div>}
                        {category.parent && <div
                            className={clsx(
                                `absolute top-0 right-0 md:right-2 bottom-0 bg-popover-element-hover flex items-center rounded-lg opacity-0 focus-within:opacity-100 pointer-events-none md:pointer-events-auto focus-within:pointer-events-auto`,
                                selected && `pointer-events-auto! opacity-100 md:opacity-0`
                            )}
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
                </div>
            </AutoHeight>
        </div>
    );
}