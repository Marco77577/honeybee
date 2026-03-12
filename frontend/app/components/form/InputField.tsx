import React, {ReactElement, useId} from "react";
import clsx from "clsx";

interface InputFieldProps {
    icon: ReactElement,
    value: string | undefined,
    placeholder?: string,
    onValueChange: (value: string) => void,
}

export default function InputField({
                                       icon,
                                       value,
                                       placeholder,
                                       onValueChange,
                                       className,
                                       ...props
                                   }: InputFieldProps & React.HTMLAttributes<HTMLDivElement>) {
    const id = useId();
    return (
        <div
            {...props}
            className={clsx(`flex items-center rounded-lg py-3 bg-input-text-background border border-input-text-border focus-within:border-input-text-border-focused outline-3 outline-transparent focus-within:outline-input-text-border-outline text-base`, className)}>
            <label className={`px-3 text-input-text-placeholder`} htmlFor={id}>
                {icon}
            </label>
            <input
                value={value}
                onChange={e => onValueChange(e.target.value)}
                id={id}
                className={`flex-1 pr-3 outline-0 placeholder-input-text-placeholder`}
                type="text"
                placeholder={placeholder}/>
        </div>
    )
}