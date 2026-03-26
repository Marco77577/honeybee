import React from "react";
import clsx from "clsx";
import {Pen, Trash} from "lucide-react";
import {AutoHeight} from "@/app/components/AutoHeight";
import ClickableIcon from "@/app/components/ClickableIcon";
import {Dialog, DialogContext} from "../components/Dialog";
import {useDraggable} from "@dnd-kit/react";
import CurrencyAbbreviation from "@/app/currency/CurrencyAbbreviation";
import UpsertAccount from "@/app/account/UpsertAccount";
import DeleteAccount from "@/app/account/DeleteAccount";
import {Account} from "@/app/context/api/queries/accounts";

interface DragAndDropAccountProps {
    account: Account,
    selected: boolean,
    open: boolean,
    first: boolean,
    onSelectAccount: (category: Account) => void,
}

export default function DragAndDropAccount({
                                               account,
                                               selected,
                                               open,
                                               first,
                                               onSelectAccount
                                           }: DragAndDropAccountProps) {
    const {
        ref: draggableRef,
        isDragging,
    } = useDraggable({
        id: account.id,
        data: {
            type: 'account',
            account
        }
    });

    return (
        <AutoHeight key={account.id}
                    open={open}>
            <div ref={draggableRef}>
                <div onClick={() => onSelectAccount(account)}
                     className={clsx(
                         `relative flex items-center gap-6 md:py-2.5 md:px-3 rounded-lg hover:bg-popover-element-hover cursor-pointer hover:**:data-options:opacity-100`,
                         isDragging && `scale-75 bg-popover-element-hover`,
                     )}>
                    <div
                        className={`flex items-center gap-2 py-1`}>
                        <CurrencyAbbreviation className={`relative top-px text-input-text-placeholder`}
                                              abbreviation={account.number.toString()}/>
                        <span className={`whitespace-nowrap truncate`}>{account.name}</span>
                    </div>
                    <div
                        className={clsx(
                            `absolute top-0 right-0 md:right-2 bottom-0 bg-popover-element-hover flex items-center rounded-lg opacity-0 focus-within:opacity-100 pointer-events-none md:pointer-events-auto focus-within:pointer-events-auto`,
                            first && `right-11!`,
                            selected && `pointer-events-auto! opacity-100 md:opacity-0`
                        )}
                        data-options>
                        <Dialog>
                            <Dialog.Trigger tabIndex={0}>
                                <ClickableIcon title={`Edit Account`}>
                                    <Pen size={20} strokeWidth={1}/>
                                </ClickableIcon>
                            </Dialog.Trigger>
                            <Dialog.Content>
                                <DialogContext.Consumer>
                                    {({close}) => (
                                        <UpsertAccount
                                            edit={account}
                                            onSuccess={close}/>
                                    )}
                                </DialogContext.Consumer>
                            </Dialog.Content>
                        </Dialog>
                        <Dialog>
                            <Dialog.Trigger tabIndex={0}>
                                <ClickableIcon title={`Delete Category`}>
                                    <Trash size={20} strokeWidth={1}/>
                                </ClickableIcon>
                            </Dialog.Trigger>
                            <Dialog.Content>
                                <DialogContext.Consumer>
                                    {({close}) => (
                                        <DeleteAccount account={account}
                                                       onSuccess={close}/>
                                    )}
                                </DialogContext.Consumer>
                            </Dialog.Content>
                        </Dialog>
                    </div>
                </div>
            </div>
        </AutoHeight>
    );
}