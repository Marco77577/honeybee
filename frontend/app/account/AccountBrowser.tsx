import {Account} from "@/app/context/api/queries/accounts";
import React, {useState} from "react";
import ClickableIcon from "@/app/components/ClickableIcon";
import {Dialog, DialogContext} from "@/app/components/Dialog";
import {FolderPen, Inbox, Plus, Search, Trash} from "lucide-react";
import UpsertAccount from "@/app/account/UpsertAccount";
import clsx from "clsx";
import CurrencyAbbreviation from "@/app/currency/CurrencyAbbreviation";
import ComboIcon from "@/app/components/ComboIcon";
import DeleteAccount from "@/app/account/DeleteAccount";
import {Category} from "@/app/context/api/queries/categories";
import {AutoHeight} from "@/app/components/AutoHeight";

interface AccountBrowserProps {
    categories: Category[],
    category: Category,
    accounts: Account[]
}

export default function AccountBrowser({
                                           categories,
                                           category,
                                           accounts,
                                           className,
                                           ...props
                                       }: AccountBrowserProps & React.HTMLAttributes<HTMLDivElement>) {
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const childrenOf = (category?: Category) => {
        return categories.filter(c => c.parent === category?.id);
    }

    const allChildrenOf = (category: Category) => {
        const children: Category[] = childrenOf(category)
            .map(allChildrenOf)
            .flat();
        return [category, ...children];
    }

    const displayByParents = allChildrenOf(category);
    const empty = accounts.filter(
        account => displayByParents.some(category => account.category === category.id)
    ).length === 0;
    const filtered = accounts
        ?.sort((a, b) => a.number - b.number)
        ?.filter(account => displayByParents.some(category => account.category === category.id));

    return (
        <div className={clsx(`relative h-full flex flex-col p-2 min-w-45`, className)} {...props}>
            {empty && <div
                className={`w-full h-full flex flex-col items-center justify-center gap-4 p-4 text-input-text-placeholder`}>
                <Search size={30} strokeWidth={1}/>
                <span className={`text-center`}>There is no account in this category.</span>
            </div>}
            <div
                className={`absolute top-1 md:top-4 right-2 md:right-4 z-10 flex items-center rounded-lg`}>
                <Dialog>
                    <Dialog.Trigger tabIndex={0}>
                        <ClickableIcon title={`Add Account`}>
                            <ComboIcon main={Inbox} secondary={Plus}/>
                        </ClickableIcon>
                    </Dialog.Trigger>
                    <Dialog.Content>
                        <DialogContext.Consumer>
                            {({close}) => (
                                <UpsertAccount category={category.id}
                                               onSuccess={close}/>
                            )}
                        </DialogContext.Consumer>
                    </Dialog.Content>
                </Dialog>
            </div>
            {
                accounts
                    ?.sort((a, b) => a.number - b.number)
                    ?.map(account => (
                        <AutoHeight key={account.id}
                                    open={displayByParents.some(category => category.id === account.category)}>
                            <div onClick={() => setSelectedAccount(account)}
                                 className={`relative flex items-center gap-6 md:py-2.5 md:px-3 rounded-lg hover:bg-popover-element-hover cursor-pointer hover:**:data-options:opacity-100`}>
                                <div
                                    className={`flex items-center gap-2 py-1`}>
                                    <CurrencyAbbreviation className={`relative top-px text-input-text-placeholder`}
                                                          abbreviation={account.number.toString()}/>
                                    <span className={`whitespace-nowrap truncate`}>{account.name}</span>
                                </div>
                                <div
                                    className={clsx(
                                        `absolute top-0 right-0 md:right-2 bottom-0 bg-popover-element-hover flex items-center rounded-lg opacity-0 focus-within:opacity-100 pointer-events-none focus-within:pointer-events-auto`,
                                        account.id === filtered?.[0]?.id && `right-11!`,
                                        account.id === selectedAccount?.id && `pointer-events-auto! opacity-100 md:opacity-0`
                                    )}
                                    data-options>
                                    <Dialog>
                                        <Dialog.Trigger tabIndex={0}>
                                            <ClickableIcon title={`Edit Account`}>
                                                <FolderPen size={20} strokeWidth={1}/>
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
                        </AutoHeight>
                    ))
            }
        </div>
    );
}

// todo better edit icon
// todo mobile solution