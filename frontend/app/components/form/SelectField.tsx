import React, {ReactElement, useId, useState} from "react";
import clsx from "clsx";
import {AutoHeight} from "@/app/components/AutoHeight";
import PopoverDivider from "@/app/components/header/profile/PopoverDivider";
import InputField from "@/app/components/form/InputField";
import {Skeleton} from "@radix-ui/themes";

interface SelectFieldProps<T> {
    icon: ReactElement,
    value?: T | null,
    options: T[],
    placeholder?: string,
    onValueChange: (value: T) => void
    toText?: (value: T) => string,
}

export default function SelectField<T>({
                                           icon,
                                           value,
                                           options,
                                           placeholder,
                                           onValueChange,
                                           toText = (value: T) => value as string,
                                           className,
                                           ...props
                                       }: SelectFieldProps<T> & React.HTMLAttributes<HTMLDivElement>) {
    const id = useId();
    const [, setSelected] = useState<T | null>(value ?? null);
    const [query, setQuery] = useState<string>(value ? toText(value) : '');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [open, setOpen] = useState(false);

    if (!options) {
        return (
            <Skeleton>
                <InputField value={``} onValueChange={() => {
                }}/>
            </Skeleton>
        );
    }

    const filteredOptions = options.filter(option => query === toText(value ?? option) ? true : toText(option).toLowerCase().includes(query.toLowerCase()));

    const handleSelect = (option: T) => {
        setSelected(option);
        onValueChange(option);
        setQuery(toText(option));
        setOpen(false);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!options.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            e.stopPropagation();
            setHighlightedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            e.stopPropagation();
            setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
        }

        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            if (highlightedIndex >= 0) {
                handleSelect(filteredOptions[highlightedIndex]);
                setHighlightedIndex(-1);
            } else {
                setOpen(true);
            }
        }

        if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            setHighlightedIndex(-1);
            setQuery(value ? toText(value) : '');
            setOpen(false);
        }
    };

    return (
        <div
            {...props}
            className={clsx(
                `flex flex-col rounded-lg py-3 bg-input-text-background border border-input-text-border focus-within:border-input-text-border-focused outline-3 outline-transparent focus-within:outline-input-text-border-outline text-base`,
                open && `pb-0`,
                className
            )}>
            <div
                className={`flex items-center`}
                onClick={() => setOpen(!open)}>
                <label className={`px-3 text-input-text-placeholder`} htmlFor={id}>
                    {icon}
                </label>
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    id={id}
                    className={`flex-1 outline-0 placeholder-input-text-placeholder`}
                    type="text"
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}/>
            </div>
            <AutoHeight open={open}>
                <div className={`pt-1`}>
                    <PopoverDivider/>
                    <div className={`p-2 max-h-60 overflow-y-scroll`}>
                        {
                            filteredOptions.map((option, i) =>
                                <div key={`select-option-${i}`}
                                     tabIndex={0}
                                     onClick={() => handleSelect(option)}
                                     className={clsx(
                                         `flex items-center rounded-md hover:bg-popover-element-hover py-2.5 px-2 cursor-pointer`,
                                         highlightedIndex === i && `bg-popover-element-hover`
                                     )}>
                                    <label className={`opacity-0 px-3 text-input-text-placeholder`}>
                                        {icon}
                                    </label>
                                    <div
                                        id={id}
                                        className={`flex-1 outline-0 placeholder-input-text-placeholder -mx-4`}>{toText(option)}</div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </AutoHeight>
        </div>
    )
}