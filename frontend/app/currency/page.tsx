"use client"

import Heading1 from "@/app/components/title/Heading1";
import {Banknote, BookSearch, Pencil, Trash} from "lucide-react";
import {useCurrenciesQuery, useMainCurrency} from "@/app/context/api/queries/currencies";
import {Skeleton} from "@radix-ui/themes";
import CurrencyAbbreviation from "@/app/currency/CurrencyAbbreviation";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import React from "react";
import clsx from "clsx";
import {useFrankfurterLatest} from "@/app/context/api/queries/frankfurter";
import UpsertCurrency from "@/app/currency/UpsertCurrency";
import ClickableIcon from "@/app/components/ClickableIcon";
import {Dialog, DialogContext} from "@/app/components/Dialog";
import DeleteCurrency from "@/app/currency/DeleteCurrency";

export function calculateLeftHandExchangeRate(rate: number) {
    let left = 1;
    while (rate < 0.1) {
        rate *= 10;
        left *= 10;
    }
    return left;
}

export function calculateRightHandExchangeRate(rate: number) {
    while (rate < 0.1) rate *= 10
    return rate;
}

function LoadingCurrency() {
    return (
        <div
            className={`grid grid-cols-subgrid col-span-5 md:col-span-6 items-center py-2.5 px-3 rounded-lg hover:bg-popover-element-hover`}>
            <div><Skeleton>USD</Skeleton></div>
            <div><Skeleton>United States Dollar</Skeleton></div>
            <div className={`hidden md:flex items-center gap-2 justify-end-safe font-mono!`}>
                <Skeleton>
                    <span className={`font-mono! flex items-center gap-1`}>
                        <span className={clsx(`font-mono!`)}>1</span>
                        <span className={`font-mono!`}>=</span>
                        <span className={clsx(`font-mono!`)}>0.7283</span>
                        <span className={`font-mono! flex items-center`}>
                            <CurrencyAbbreviation abbreviation={`USD`}/>
                        </span>
                    </span>
                </Skeleton>
            </div>
            <div><Skeleton>Frankfurter</Skeleton></div>
            <div><Skeleton><ClickableIcon><Pencil size={20}/></ClickableIcon></Skeleton></div>
            <div><Skeleton><ClickableIcon><Trash size={20}/></ClickableIcon></Skeleton></div>
        </div>
    )
}

export default function Currency() {
    // LOAD DATA FROM BACKEND
    const mainCurrency = useMainCurrency();
    const {data: currencies} = useCurrenciesQuery();
    const {data: latestExchangeRates} = useFrankfurterLatest(mainCurrency?.abbreviation);

    return (
        <div className={`flex flex-col gap-6 py-16`}>
            <div className={`mx-auto container px-4 md:px-0 flex flex-col gap-6`}>
                <div className={`w-full max-w-xl mx-auto flex flex-col gap-6`}>
                    <Heading1 title={`Currencies`}
                              icon={<Banknote size={40} strokeWidth={1}/>}/>
                    <p>Automatic exchange rates are determined via <a href={`https://frankfurter.dev/`}
                                                                      target={`_blank`}>Frankfurter
                        API</a>.</p>
                </div>
                <div className={`w-full max-w-xl mx-auto flex flex-col gap-3`}>
                    <div
                        className={`grid grid-cols-[min-content_1fr_min-content_min-content_min-content] md:grid-cols-[min-content_1fr_1fr_min-content_min-content_min-content] gap-x-3 rounded-lg p-2 bg-input-text-background border border-input-text-border text-input-text-foreground outline-3 outline-transparent hover:outline-input-text-border-outline`}>
                        {
                            currencies
                                ?.filter(currency => currency.id !== mainCurrency?.id)
                                ?.map(currency => (
                                    <div
                                        key={currency.id}
                                        className={`grid grid-cols-subgrid col-span-5 md:col-span-6 items-center py-2.5 px-3 rounded-lg hover:bg-popover-element-hover`}>
                                        <div><CurrencyAbbreviation abbreviation={currency.abbreviation}/></div>
                                        <div>{currency.name}</div>
                                        <div
                                            className={`hidden md:flex items-center gap-2 justify-end-safe font-mono!`}>
                                            <span className={`font-mono! flex items-center gap-1`}>
                                                <span
                                                    className={clsx(`font-mono!`, currency.manualExchangeRate !== undefined && `hidden`)}>
                                                    {calculateLeftHandExchangeRate(1 / (latestExchangeRates?.rates.get(currency.abbreviation) ?? 1)).toFixed(0)}
                                                </span>
                                                <span
                                                    className={clsx(`font-mono!`, currency.manualExchangeRate === undefined && `hidden`)}>
                                                    {calculateLeftHandExchangeRate(currency.manualExchangeRate ?? 1).toFixed(0)}
                                                </span>
                                                <span className={`font-mono!`}>=</span>
                                                <span
                                                    className={clsx(`font-mono!`, currency.manualExchangeRate !== undefined && `hidden`)}>
                                                    {calculateRightHandExchangeRate(1 / (latestExchangeRates?.rates.get(currency.abbreviation) ?? 1)).toFixed(4)}
                                                </span>
                                                <span
                                                    className={clsx(`font-mono!`, currency.manualExchangeRate === undefined && `hidden`)}>
                                                    {calculateRightHandExchangeRate(currency.manualExchangeRate ?? 1).toFixed(4)}
                                                </span>
                                                <span className={`font-mono! flex items-center`}>
                                                    <CurrencyAbbreviation abbreviation={mainCurrency?.abbreviation}/>
                                                </span>
                                            </span>
                                        </div>
                                        <div className={clsx(currency.manualExchangeRate !== undefined && `hidden`)}>
                                            <div
                                                className={clsx(`inline-flex items-center gap-1 text-xs rounded-md bg-honey text-white p-1`,)}>
                                                <BookSearch size={15}/>
                                                <span>Frankfurter</span>
                                            </div>
                                        </div>
                                        <div className={clsx(currency.manualExchangeRate === undefined && `hidden`)}>
                                            <span
                                                className={clsx(`text-xs rounded-md bg-popover-element-hover p-1`)}>Manual</span>
                                        </div>
                                        <Dialog>
                                            <Dialog.Trigger tabIndex={0}>
                                                <ClickableIcon title={`Edit Currency`}>
                                                    <Pencil size={20} strokeWidth={1}/>
                                                </ClickableIcon>
                                            </Dialog.Trigger>
                                            <Dialog.Content>
                                                <DialogContext.Consumer>
                                                    {({close}) => (
                                                        <UpsertCurrency
                                                            edit={currency}
                                                            onSuccess={close}
                                                        />
                                                    )}
                                                </DialogContext.Consumer>
                                            </Dialog.Content>
                                        </Dialog>
                                        <Dialog>
                                            <Dialog.Trigger tabIndex={0}>
                                                <ClickableIcon title={`Delete Currency`}>
                                                    <Trash size={20} strokeWidth={1}/>
                                                </ClickableIcon>
                                            </Dialog.Trigger>
                                            <Dialog.Content>
                                                <DialogContext.Consumer>
                                                    {({close}) => (
                                                        <DeleteCurrency
                                                            currency={currency}
                                                            onSuccess={close}
                                                        />
                                                    )}
                                                </DialogContext.Consumer>
                                            </Dialog.Content>
                                        </Dialog>
                                    </div>
                                )) ?? Array.from({length: 5}, (_, i) => <LoadingCurrency key={i}/>)
                        }
                    </div>
                    <div className={`flex justify-end`}>
                        <Dialog>
                            <Dialog.Trigger tabIndex={0}>
                                <PrimaryButton title={`Add Currency`}/>
                            </Dialog.Trigger>
                            <Dialog.Content>
                                <DialogContext.Consumer>
                                    {({close}) => (
                                        <UpsertCurrency onSuccess={close}/>
                                    )}
                                </DialogContext.Consumer>
                            </Dialog.Content>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    )
}