"use client"

import {
    Building2,
    Calendar,
    CalendarArrowDown,
    CalendarArrowUp,
    CalendarClock,
    CalendarSearch,
    Scale
} from "lucide-react";
import React, {useState} from "react";
import {AutoHeight} from "@/app/components/AutoHeight";
import InputField from "@/app/components/form/InputField";
import RadioField from "@/app/components/form/RadioField";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import {
    LegalForm,
    legalForms,
    legalFormToIcon,
    legalFormToText,
    legalFormToTitle
} from "@/app/organization/setup/legal-form.util";
import {formatFiscalYear} from "@/app/organization/setup/fiscal-year.util";
import SelectField from "@/app/components/form/SelectField";

export default function SetupOrganization() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const previousYears = Array.from({length: 10}, (_, i) => currentYear - i - 1);

    const [organizationName, setOrganizationName] = useState<string>();
    const [legalForm, setLegalForm] = useState<LegalForm | undefined>(undefined);
    const [firstFiscalYear, setFirstFiscalYear] = useState<number | undefined>(undefined);
    const [previousYear, setPreviousYear] = useState<number>(currentYear - 1);

    const [isOrganizationNameSet, setIsOrganizationNameSet] = useState<boolean>(false);
    const [isLegalFormSet, setIsLegalFormSet] = useState<boolean>(false);
    const [isFirstFiscalYearSet, setIsFirstFiscalYearSet] = useState<boolean>(false);

    const handleOrganizationNameChange = (value: string) => {
        setIsOrganizationNameSet(value.length !== 0);
        setOrganizationName(value);
    };

    const handleLegalFormChange = (value: string) => {
        setIsLegalFormSet(true);
        setLegalForm(value as LegalForm);
    };

    const handleFirstFiscalYearChange = (value: number) => {
        setIsFirstFiscalYearSet(true);
        setFirstFiscalYear(value);
    };

    const handlePreviousYearChange = (value: string) => {
        let numbersOnly = value.replace(/\D/g, "") as unknown as number;
        if (numbersOnly >= currentYear) numbersOnly = currentYear - 1;
        setFirstFiscalYear(numbersOnly);
        setPreviousYear(numbersOnly);
    };

    return (
        <div className={`flex flex-col gap-12`}>
            <div className={`flex flex-col gap-6`}>
                <div className={`flex flex-col gap-3`}>
                    <Building2 size={40} strokeWidth={1}/>
                    <h1>Let&#39;s Create a New Organization</h1>
                </div>
                <InputField
                    icon={<Building2 strokeWidth={1}/>}
                    value={organizationName}
                    onValueChange={handleOrganizationNameChange}
                    placeholder="Enter the name of your organization to get started ..."/>
            </div>
            <AutoHeight open={isOrganizationNameSet}>
                <div className={`flex flex-col gap-6`}>
                    <div className={`flex flex-col gap-3`}>
                        <Scale size={40} strokeWidth={1}/>
                        <h2 className={`text-2xl!`}>What Is {organizationName} Legally?</h2>
                    </div>
                    <div className={`flex flex-col gap-3`}>
                        {
                            legalForms.map(key => {
                                    return (
                                        <RadioField
                                            key={key}
                                            value={key}
                                            checked={legalForm === key}
                                            onValueChange={handleLegalFormChange}
                                            title={legalFormToTitle(key)}
                                            subtitle={legalFormToText(key)}
                                            icon={legalFormToIcon(key)}
                                        />
                                    )
                                }
                            )
                        }
                    </div>
                </div>
            </AutoHeight>
            <AutoHeight open={isLegalFormSet && isOrganizationNameSet}>
                <div className={`flex flex-col gap-6`}>
                    <div className={`flex flex-col gap-3`}>
                        <Calendar size={40} strokeWidth={1}/>
                        <h2 className={`text-2xl!`}>What Year Will Be Your First Fiscal Period?</h2>
                    </div>
                    <div className={`flex flex-col gap-3`}>
                        <RadioField
                            value={currentYear}
                            checked={firstFiscalYear === currentYear}
                            onValueChange={() => handleFirstFiscalYearChange(currentYear)}
                            title="This Year"
                            subtitle={`Create book entries starting on ${formatFiscalYear(currentYear)}.`}
                            icon={<CalendarArrowDown/>}
                        />
                        <RadioField
                            value={nextYear}
                            checked={firstFiscalYear === nextYear}
                            onValueChange={() => handleFirstFiscalYearChange(nextYear)}
                            title="Next Year"
                            subtitle={`Create book entries starting on ${formatFiscalYear(nextYear)}.`}
                            icon={<CalendarArrowUp/>}
                        />
                        <RadioField
                            value={previousYear}
                            checked={firstFiscalYear === previousYear}
                            onValueChange={() => handleFirstFiscalYearChange(previousYear)}
                            title="Previous Year"
                            subtitle={`Create book entries starting on ${formatFiscalYear(previousYear)}.`}
                            icon={<CalendarClock/>}
                        />
                        <AutoHeight open={firstFiscalYear === previousYear}>
                            <SelectField
                                icon={<CalendarSearch/>}
                                value={previousYear.toString()}
                                onValueChange={value => handlePreviousYearChange(value)}
                                placeholder="Enter the year of your first fiscal period ..."
                                options={previousYears.map(year => year.toString())}/>
                        </AutoHeight>
                    </div>
                </div>
            </AutoHeight>
            <AutoHeight open={isFirstFiscalYearSet && isLegalFormSet && isOrganizationNameSet}>
                <PrimaryButton title="Finish Setup" onClick={() => {
                }}/>
            </AutoHeight>
        </div>
    )
}
