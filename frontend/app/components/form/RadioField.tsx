import React, {ReactElement} from "react";
import clsx from "clsx";
import {Check} from "lucide-react";

interface InputFieldProps<T extends (string | number | readonly string[] | undefined)> {
    icon: ReactElement,
    title: string,
    subtitle: string,
    value: T,
    checked: boolean,
    onValueChange: (value: T) => void,
}

export default function RadioField<T extends (string | number | readonly string[] | undefined)>({
                                       icon,
                                       title,
                                       subtitle,
                                       value,
                                       checked,
                                       onValueChange,
                                       ...props
                                   }: InputFieldProps<T> & React.HTMLAttributes<HTMLLabelElement>) {
    return (
        <label {...props}>
            <input
                className={`hidden`}
                type="radio"
                value={value}
                checked={checked}
                onChange={() => onValueChange(value)}
            />
            <div className={clsx(
                `flex items-center gap-3 py-2.5 px-2 rounded-lg cursor-pointer bg-input-text-background border border-input-text-border outline-3 outline-transparent text-popover-foreground hover:bg-popover-element-hover`,
                checked && `outline-input-text-border-outline! border-input-text-border-focused **:data-icon:text-lawn hover:**:data-icon:text-lawn`
            )}>
                <div data-icon className={`px-2`}>
                    {!checked && icon}
                    {checked && <Check/>}
                </div>
                <div className={`flex flex-col flex-1`}>
                    <div
                        className={`font-bold text-sm text-popover-foreground-title`}>{title}</div>
                    <div className={`text-[13px]`}>{subtitle}</div>
                </div>
            </div>
        </label>
    )
}