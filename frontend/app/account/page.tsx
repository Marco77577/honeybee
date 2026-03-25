"use client"

import Heading1 from "@/app/components/title/Heading1";
import {Inbox, PanelLeftOpen} from "lucide-react";
import React, {useEffect, useState} from "react";
import {Category, useCategoriesQuery} from "@/app/context/api/queries/categories";
import {useAccountsQuery} from "@/app/context/api/queries/accounts";
import CategoryBrowser from "@/app/account/CategoryBrowser";
import AccountBrowser from "@/app/account/AccountBrowser";
import {Group, Panel, Separator, usePanelRef} from "react-resizable-panels";
import ClickableIcon from "@/app/components/ClickableIcon";

export default function AccountPage() {
    const {data: categories} = useCategoriesQuery();
    const {data: accounts} = useAccountsQuery();

    const [category, setCategory] = useState<Category | null>(null);

    const categoryPanelRef = usePanelRef();
    const [isCategoryPanelCollapsed, setIsCategoryPanelCollapsed] = useState(false);

    return (
        <div className={`flex flex-col gap-6 py-16`}>
            <div className={`mx-auto container px-4 md:px-0`}>
                <div className={`w-full max-w-4xl mx-auto flex flex-col gap-6`}>
                    <Heading1 title={`Accounts`}
                              icon={<Inbox size={40} strokeWidth={1}/>}/>
                    <div
                        className={`rounded-lg bg-input-text-background border border-input-text-border text-input-text-foreground outline-3 outline-transparent hover:outline-input-text-border-outline`}>
                        {(categories && accounts) &&
                            <Group onLayoutChanged={
                                () => setIsCategoryPanelCollapsed(categoryPanelRef.current?.isCollapsed() ?? false)}>
                                <Panel panelRef={categoryPanelRef}
                                       minSize={200}
                                       collapsible
                                       collapsedSize={52}
                                       defaultSize="30%">
                                    {!isCategoryPanelCollapsed && <CategoryBrowser categories={categories}
                                                                                   onCollapsePanel={() => categoryPanelRef.current?.collapse()}
                                                                                   onCategory={setCategory}/>}
                                    {isCategoryPanelCollapsed &&
                                        <div className={`flex flex-col gap-3 p-2 h-full cursor-pointer`}
                                             onClick={() => categoryPanelRef.current?.expand()}>
                                            <div>
                                                <ClickableIcon title={`Open Category Panel`}>
                                                    <PanelLeftOpen size={20} strokeWidth={1}/>
                                                </ClickableIcon>
                                            </div>
                                            <div className={`pt-8`}>
                                                    <span
                                                        className={`block whitespace-nowrap -rotate-90`}>Categories</span>
                                            </div>
                                        </div>}
                                </Panel>
                                <Separator className={`bg-input-text-border w-px outline-none`}/>
                                <Panel minSize={200}>
                                    <AccountBrowser
                                        categories={categories}
                                        category={category ?? categories[0]}
                                        accounts={accounts}/>
                                </Panel>
                            </Group>
                        }
                        {(!categories || !accounts) &&
                            <div>screen is loading</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}