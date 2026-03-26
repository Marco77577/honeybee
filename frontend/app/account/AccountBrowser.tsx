import {Account} from "@/app/context/api/queries/accounts";
import React, {useState} from "react";
import ClickableIcon from "@/app/components/ClickableIcon";
import {Dialog, DialogContext} from "@/app/components/Dialog";
import {Inbox, Plus, Search} from "lucide-react";
import UpsertAccount from "@/app/account/UpsertAccount";
import clsx from "clsx";
import ComboIcon from "@/app/components/ComboIcon";
import {Category} from "@/app/context/api/queries/categories";
import {allChildrenOf} from "@/app/account/category-tree";
import DragAndDropAccount from "@/app/account/DragAndDropAccount";

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

    const displayByParents = allChildrenOf(category, categories);
    const empty = accounts.filter(
        account => displayByParents.some(category => account.category === category.id)
    ).length === 0;
    const filtered = accounts
        ?.sort((a, b) => a.number - b.number)
        ?.filter(account => displayByParents.some(category => account.category === category.id));

    return (
        <div className={`max-h-[70vh] overflow-y-scroll`}>
            <div className={clsx(`relative h-full flex flex-col p-2 min-w-45`, className)} {...props}>
                {empty && <div
                    className={`w-full h-full flex flex-col items-center justify-center gap-4 p-4 text-input-text-placeholder`}>
                    <Search size={30} strokeWidth={1}/>
                    <span className={`text-center`}>There is no account in this category.</span>
                </div>}
                <div
                    className={`absolute top-1 md:top-3.5 right-2 md:right-4 z-10 flex items-center rounded-lg`}>
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
                            <DragAndDropAccount
                                key={account.id}
                                account={account}
                                selected={account.id === selectedAccount?.id}
                                open={displayByParents.some(category => category.id === account.category)}
                                first={account.id === filtered?.[0]?.id}
                                onSelectAccount={setSelectedAccount}/>
                        ))
                }
            </div>
        </div>
    );
}