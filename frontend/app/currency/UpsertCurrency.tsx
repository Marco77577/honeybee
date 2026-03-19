import React, {useEffect, useState} from "react";
import Heading2 from "@/app/components/title/Heading2";
import {BanknoteArrowDown, BookSearch, DollarSign, Tag} from "lucide-react";
import InputField from "@/app/components/form/InputField";
import Heading3 from "@/app/components/title/Heading3";
import {AutoHeight} from "@/app/components/AutoHeight";
import RadioField from "@/app/components/form/RadioField";
import CurrencyAbbreviation from "@/app/currency/CurrencyAbbreviation";
import SecondaryButton from "@/app/components/button/SecondaryButton";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import {frankfurterKeys, useFrankfurterLatest} from "@/app/context/api/queries/frankfurter";
import {useQueryClient} from "@tanstack/react-query";
import {
    Currency,
    useCreateCurrencyMutation,
    useMainCurrency,
    useUpdateCurrencyMutation
} from "@/app/context/api/queries/currencies";
import {ComAccountingConfigError, ResponseError} from "@/app/generated/api";
import {useOrganization} from "@/app/context/OrganizationProvider";
import {calculateLeftHandExchangeRate, calculateRightHandExchangeRate} from "@/app/currency/page";

interface UpsertCurrencyProps {
    edit?: Currency,
    onSuccess: () => void,
}

export default function UpsertCurrency({edit, onSuccess}: UpsertCurrencyProps & React.HTMLAttributes<HTMLDivElement>) {
    // dependencies
    const queryClient = useQueryClient();
    const organization = useOrganization();
    const mainCurrency = useMainCurrency();
    const createCurrency = useCreateCurrencyMutation();
    const updateCurrency = useUpdateCurrencyMutation();
    const {data: latestExchangeRates} = useFrankfurterLatest(mainCurrency?.abbreviation);

    // states
    const [abbreviation, setAbbreviation] = useState<string>(edit ? edit.abbreviation : '');
    const [name, setName] = useState<string>(edit ? edit.name : '');
    const [manualExchangeRate, setManualExchangeRate] = useState<number | null>(edit ? edit.manualExchangeRate ?? null : 0.5);
    const [exchangeRateMain, setExchangeRateMain] = useState<number>(edit?.manualExchangeRate ? calculateRightHandExchangeRate(edit.manualExchangeRate) : 0.5);
    const [exchangeRateCurrency, setExchangeRateCurrency] = useState<number>(edit?.manualExchangeRate ? calculateLeftHandExchangeRate(edit.manualExchangeRate) : 1);
    const [isAbbreviationError, setIsAbbreviationError] = useState<boolean>(false);
    const [isNameError, setIsNameError] = useState<boolean>(false);
    const [isServerError, setIsServerError] = useState<boolean>(false);

    // effects
    useEffect(() => {
        if (mainCurrency != null) queryClient.invalidateQueries({queryKey: frankfurterKeys.latest}).then();
    }, [mainCurrency, queryClient]);

    const handleAbbreviationChange = (value: string) => {
        const abbreviation = value.substring(0, 3).toUpperCase();
        setAbbreviation(abbreviation);
        setIsAbbreviationError(abbreviation.length !== 3);

        if (latestExchangeRates && latestExchangeRates.isCurrencyAvailable(abbreviation)) {
            const name = latestExchangeRates.names.get(abbreviation);
            if (name) setName(name);

            const rate = latestExchangeRates.rates.get(abbreviation);
            if (rate) {
                setExchangeRateMain(calculateRightHandExchangeRate(1 / rate));
                setExchangeRateCurrency(calculateLeftHandExchangeRate(1 / rate));
                setManualExchangeRate(null);
            }
        } else {
            setManualExchangeRate(exchangeRateMain / exchangeRateCurrency);
        }
    };

    const handleNameChange = (name: string) => {
        setName(name);
        setIsNameError(name.length === 0);
    }

    const handleManualExchangeRateClick = () => {
        if (latestExchangeRates && latestExchangeRates.isCurrencyAvailable(abbreviation)) {
            const rate = latestExchangeRates.rates.get(abbreviation);
            if (rate) {
                const exchangeRateMain = calculateRightHandExchangeRate(1 / rate);
                const exchangeRateCurrency = calculateLeftHandExchangeRate(1 / rate);
                setExchangeRateMain(exchangeRateMain);
                setExchangeRateCurrency(exchangeRateCurrency);
                setManualExchangeRate(exchangeRateMain / exchangeRateCurrency);
            }
        }
    }

    const handleExchangeRateMainChange = (value: string) => {
        if (value === '') value = `0.5`;
        let exchangeRateMain = value.replace(/\D\./g, "") as unknown as number;
        if (exchangeRateMain < 0) exchangeRateMain = 0.1;
        setExchangeRateMain(exchangeRateMain);
        setManualExchangeRate(exchangeRateMain / exchangeRateCurrency);
    };

    const handleExchangeRateCurrencyChange = (value: string) => {
        if (value === '') value = `1`;
        let exchangeRateCurrency = value.replace(/\D\./g, "") as unknown as number;
        if (exchangeRateCurrency < 0) exchangeRateCurrency = 0.1;
        setExchangeRateCurrency(exchangeRateCurrency);
        setManualExchangeRate(exchangeRateMain / exchangeRateCurrency);
    };

    const handleServerError = async (e: Error) => {
        const error = (await (e as ResponseError).response.json()) as ComAccountingConfigError;
        console.error(error);
        setIsServerError(true);
    }

    const handleReset = () => {
        setAbbreviation('');
        setName('');
        setManualExchangeRate(0.5);
        setExchangeRateMain(0.5);
        setExchangeRateCurrency(1);
        setIsAbbreviationError(false);
        setIsNameError(false);
        setIsServerError(false);
        onSuccess();
    }

    const handleCreateClick = () => {
        const organizationId = organization?.id;
        if (organizationId == null || isAbbreviationError || isNameError) {
            setIsServerError(true);
            return;
        }

        createCurrency.mutate(
            {
                organizationId,
                comAccountingApiCurrencyModelCreateCurrency: {
                    abbreviation,
                    name,
                    manualExchangeRate
                }
            },
            {
                onSuccess: handleReset,
                onError: handleServerError
            }
        );
    }

    const handleUpdateClick = () => {
        const organizationId = organization?.id;
        const currencyId = edit?.id;
        if (organizationId == null || !currencyId || isAbbreviationError || isNameError) {
            setIsServerError(true);
            return;
        }

        updateCurrency.mutate(
            {
                organizationId,
                comAccountingApiCurrencyModelUpdateCurrency: {
                    id: currencyId,
                    abbreviation,
                    name,
                    manualExchangeRate
                }
            },
            {
                onSuccess: handleReset,
                onError: handleServerError
            }
        );
    }

    return (
        <div className={`w-full max-w-xl mx-auto flex flex-col gap-3 py-4`}>
            <div className={`flex flex-col gap-1`}>
                <Heading2 title={edit ? `Edit Currency` : `New Currency`}
                          icon={<BanknoteArrowDown size={40} strokeWidth={1}/>}/>
                {!edit && <p>What currency would you like to add?</p>}
                <div className={`flex items-center gap-2`}>
                    <InputField
                        leading={<DollarSign/>}
                        placeholder={`USD`}
                        value={abbreviation}
                        className={`max-w-25`}
                        onValueChange={handleAbbreviationChange}
                        disabled={edit !== undefined}
                        error={isAbbreviationError}/>
                    <InputField
                        leading={<Tag/>}
                        placeholder={`United States Dollar`}
                        value={name}
                        className={`flex-1`}
                        onValueChange={handleNameChange}
                        error={isNameError}/>
                </div>
            </div>
            <div className={`flex flex-col gap-1`}>
                <Heading3 title={`Exchange Rate`}/>
                <div className={`flex flex-col gap-3`}>
                    <p>What exchange rate is to be applied when you use this currency?</p>
                    <AutoHeight open={latestExchangeRates?.isCurrencyAvailable(abbreviation) === true}>
                        <RadioField icon={<BookSearch/>}
                                    title={`Automatic Exchange Rate`}
                                    subtitle={`Use the Frankfurt API to determine the current exchange rate when booking entries.`}
                                    value={manualExchangeRate}
                                    checked={manualExchangeRate === null}
                                    onValueChange={() => setManualExchangeRate(null)}/>
                    </AutoHeight>
                    <RadioField icon={<BookSearch/>}
                                title={`Manual Exchange Rate`}
                                subtitle={`Define exchange rate manually.`}
                                value={manualExchangeRate}
                                checked={manualExchangeRate !== null}
                                onValueChange={handleManualExchangeRateClick}/>
                    <AutoHeight open={manualExchangeRate !== null}>
                        <div className={`flex items-center gap-2`}>
                            <InputField
                                trailing={<CurrencyAbbreviation abbreviation={abbreviation}/>}
                                placeholder={`1`}
                                value={exchangeRateCurrency.toString()}
                                className={`flex-1`}
                                onValueChange={handleExchangeRateCurrencyChange}/>
                            <span>=</span>
                            <InputField
                                trailing={<CurrencyAbbreviation abbreviation={mainCurrency?.abbreviation}/>}
                                placeholder={`0.5`}
                                value={exchangeRateMain.toString()}
                                className={`flex-1`}
                                onValueChange={handleExchangeRateMainChange}/>
                        </div>
                    </AutoHeight>
                </div>
            </div>
            {isServerError && <div className={`text-error text-end`}>Unable to save currency.</div>}
            <div className={`flex items-center justify-end gap-3`}>
                <SecondaryButton title={`Cancel`}
                                 onClick={handleReset}/>
                <PrimaryButton title={edit ? `Save` : `Add`}
                               loading={edit ? updateCurrency.isPending : createCurrency.isPending}
                               disabled={isAbbreviationError || isNameError}
                               onClick={edit ? handleUpdateClick : handleCreateClick}/>
            </div>
        </div>
    )
}

UpsertCurrency.defaultProps = {
    edit: undefined,
    onSuccess: () => {
    }
}