"use client"

import Heading1 from "@/app/components/title/Heading1";
import {Banknote, BanknoteX, BookSearch, Pencil, Trash} from "lucide-react";
import {
    Currency as PublicCurrency,
    useCurrenciesQuery,
    useDeleteCurrencyMutation,
    useMainCurrency
} from "@/app/context/api/queries/currencies";
import {Skeleton} from "@radix-ui/themes";
import CurrencyAbbreviation from "@/app/currency/CurrencyAbbreviation";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import React, {useState} from "react";
import {AutoHeight} from "@/app/components/AutoHeight";
import clsx from "clsx";
import {useFrankfurterLatest} from "@/app/context/api/queries/frankfurter";
import UpsertCurrency from "@/app/currency/UpsertCurrency";
import {useOrganization} from "@/app/context/OrganizationProvider";
import Heading2 from "@/app/components/title/Heading2";
import SecondaryButton from "@/app/components/button/SecondaryButton";

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
            <div><Skeleton><Pencil size={20}/></Skeleton></div>
            <div><Skeleton><Trash size={20}/></Skeleton></div>
        </div>
    )
}

export default function Currency() {
    // LOAD DATA FROM BACKEND
    const organization = useOrganization();
    const mainCurrency = useMainCurrency();
    const {data: currencies} = useCurrenciesQuery();
    const {data: latestExchangeRates} = useFrankfurterLatest(mainCurrency?.abbreviation);

    // UPSERT CURRENCY STATES & HANDLERS
    const [isCreatingCurrency, setIsCreatingCurrency] = useState<boolean>(false);
    const [isUpdatingCurrency, setIsUpdatingCurrency] = useState<boolean>(false);
    const [isDeletingCurrency, setIsDeletingCurrency] = useState<boolean>(false);
    const [isServerError, setIsServerError] = useState<boolean>(false);
    const [updatingCurrency, setUpdatingCurrency] = useState<PublicCurrency | undefined>(undefined);
    const [deletingCurrency, setDeletingCurrency] = useState<PublicCurrency | undefined>(undefined);

    const handleEditClick = (currency: PublicCurrency) => {
        setUpdatingCurrency(currency);
        setIsUpdatingCurrency(true);
    }

    const handleDeleteClick = (currency: PublicCurrency) => {
        setDeletingCurrency(currency);
        setIsDeletingCurrency(true);
    }

    const handleEditCurrencyDoneClick = () => {
        setUpdatingCurrency(undefined);
        setIsUpdatingCurrency(false);
    }

    const handleDeleteCurrencyDoneClick = () => {
        setDeletingCurrency(undefined);
        setIsDeletingCurrency(false);
    }

    const deleteCurrency = useDeleteCurrencyMutation();

    const handleCurrencyDelete = () => {
        const organizationId = organization?.id;
        const currencyId = deletingCurrency?.id;
        if (organizationId == null || !currencyId) {
            setIsServerError(true);
            return;
        }

        deleteCurrency.mutate(
            {
                organizationId,
                currencyId
            },
            {
                onSuccess: () => {
                    handleDeleteCurrencyDoneClick();
                    setIsServerError(false);
                },
                onError: () => setIsServerError(true)
            }
        );
    }

    return (
        <div className={`flex flex-col gap-6 py-16`}>
            <div className={`mx-auto container px-4 md:px-0`}>
                <div className={`w-full max-w-xl mx-auto flex flex-col gap-6`}>
                    <Heading1 title={`Currencies`}
                              icon={<Banknote size={40} strokeWidth={1}/>}/>
                    <p>Automatic exchange rates are determined via <a href={`https://frankfurter.dev/`}
                                                                      target={`_blank`}>Frankfurter
                        API</a>.</p>
                </div>
            </div>

            {/* UPDATE CURRENCY */}
            <AutoHeight open={isUpdatingCurrency}>
                <div className={`bg-popover-element-hover w-full`}>
                    <div className={`mx-auto container px-4 md:px-0`}>
                        <UpsertCurrency key={updatingCurrency?.id}
                                        edit={updatingCurrency}
                                        onSuccess={handleEditCurrencyDoneClick}/>
                    </div>
                </div>
            </AutoHeight>

            {/* DELETE CURRENCY */}
            <AutoHeight open={isDeletingCurrency}>
                <div className={`bg-popover-element-hover w-full`}>
                    <div className={`mx-auto container px-4 md:px-0`}>
                        <div className={`w-full max-w-xl mx-auto flex flex-col gap-3 py-4`}>
                            <div className={`flex flex-col gap-1`}>
                                <Heading2 title={`Delete Currency`}
                                          icon={<BanknoteX size={40} strokeWidth={1}/>}/>
                                <p>Are you sure you want to delete currency <span className={`inline-flex items-center gap-2`}>
                                    <CurrencyAbbreviation
                                        abbreviation={deletingCurrency?.abbreviation}/><span>{deletingCurrency?.name}</span></span>?
                                </p>
                                <p>This cannot be undone.</p>
                                <div className={`flex items-center justify-end gap-3`}>
                                    <SecondaryButton title={`Delete`}
                                                     loading={deleteCurrency.isPending}
                                                     onClick={handleCurrencyDelete}/>
                                    <PrimaryButton title={`Cancel`}
                                                   onClick={handleDeleteCurrencyDoneClick}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AutoHeight>

            {/* TABLE */}
            <div className={`mx-auto container px-4 md:px-0`}>
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
                                        <div className={`hidden md:flex items-center gap-2 justify-end-safe font-mono!`}>
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
                                        <div
                                            className={`rounded-md cursor-pointer p-2 hover:bg-input-text-border-outline`}
                                            title={`Edit Currency`}
                                            onClick={() => handleEditClick(currency)}>
                                            <Pencil size={20} strokeWidth={1}/>
                                        </div>
                                        <div
                                            className={`rounded-md cursor-pointer p-2 hover:bg-input-text-border-outline`}
                                            title={`Delete Currency`}
                                            onClick={() => handleDeleteClick(currency)}>
                                            <Trash size={20} strokeWidth={1}/>
                                        </div>
                                    </div>
                                )) ?? Array.from({length: 5}, (_, i) => <LoadingCurrency key={i}/>)
                        }
                    </div>
                    <AutoHeight open={!isCreatingCurrency}>
                        <div className={`flex justify-end`}>
                            <PrimaryButton title={`Add Currency`}
                                           onClick={() => setIsCreatingCurrency(true)}/>
                        </div>
                    </AutoHeight>
                </div>
            </div>

            {/* CREATE CURRENCY */}
            <AutoHeight open={isCreatingCurrency}>
                <div className={`bg-popover-element-hover w-full`}>
                    <div className={`mx-auto container px-4 md:px-0`}>
                        <UpsertCurrency onSuccess={() => setIsCreatingCurrency(false)}/>
                    </div>
                </div>
            </AutoHeight>
        </div>
    )
}