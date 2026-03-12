import React, {ReactElement, useId, useState} from "react";
import clsx from "clsx";
import {AutoHeight} from "@/app/components/AutoHeight";
import PopoverDivider from "@/app/components/header/profile/PopoverDivider";

interface SelectFieldProps {
    icon: ReactElement,
    value: string | undefined,
    options: string[],
    placeholder?: string,
    onValueChange: (value: string) => void,
}

export default function SelectField({
                                        icon,
                                        value,
                                        options,
                                        placeholder,
                                        onValueChange,
                                        className,
                                        ...props
                                    }: SelectFieldProps & React.HTMLAttributes<HTMLDivElement>) {
    const id = useId();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            {...props}
            className={clsx(
                `flex flex-col rounded-lg py-3 bg-input-text-background border border-input-text-border focus-within:border-input-text-border-focused outline-3 outline-transparent focus-within:outline-input-text-border-outline text-base`,
                isOpen && `pb-0`,
                className
            )}>
            <div
                className={`flex items-center`}
                onClick={() => setIsOpen(!isOpen)}>
                <label className={`px-3 text-input-text-placeholder`} htmlFor={id}>
                    {icon}
                </label>
                <input
                    value={value}
                    onChange={e => onValueChange(e.target.value)}
                    id={id}
                    className={`flex-1 outline-0 placeholder-input-text-placeholder`}
                    type="text"
                    placeholder={placeholder}/>
            </div>
            <AutoHeight open={isOpen}>
                <div className={`pt-1 -mb-2`}>
                    <PopoverDivider/>
                    <div className={`p-2`}>
                        {
                            options.map(option =>
                                <div
                                    key={option}
                                    onClick={() => {
                                        onValueChange(option);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-center rounded-md hover:bg-popover-element-hover py-2.5 px-2 cursor-pointer`}>
                                    <label className={`opacity-0 px-3 text-input-text-placeholder`}>
                                        {icon}
                                    </label>
                                    <div
                                        id={id}
                                        className={`flex-1 outline-0 placeholder-input-text-placeholder -mx-4`}>{option}</div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </AutoHeight>
        </div>
    )
}