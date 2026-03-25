import React, {ReactElement, useId} from "react";
import clsx from "clsx";

interface InputFieldProps {
    leading?: ReactElement,
    trailing?: ReactElement,
    value: string | undefined,
    placeholder?: string,
    onValueChange: (value: string) => void,
    disabled?: boolean,
    error?: boolean,
}

export default function InputField({
                                       leading,
                                       trailing,
                                       value,
                                       placeholder,
                                       onValueChange,
                                       className,
                                       disabled = false,
                                       error = false,
                                       ...props
                                   }: InputFieldProps & React.HTMLAttributes<HTMLDivElement>) {
    const id = useId();
    return (
        <div
            {...props}
            className={clsx(
                `flex items-center gap-3 rounded-lg p-3 bg-input-text-background border border-input-text-border focus-within:border-input-text-border-focused outline-3 outline-transparent focus-within:outline-input-text-border-outline text-base`,
                disabled && `bg-popover-element-hover`,
                error && `border-error! focus-within:outline-error/30!`,
                className
            )}>
            {leading && <label className={`text-input-text-placeholder`} htmlFor={id}>
                {leading}
            </label>}
            <input
                value={value}
                onChange={e => onValueChange(e.target.value)}
                id={id}
                className={clsx(
                    `flex-1 outline-0 placeholder-input-text-placeholder`,
                    !leading && trailing && `text-end`,
                )}
                type="text"
                disabled={disabled}
                placeholder={placeholder}/>
            {trailing && <label className={`text-input-text-placeholder`} htmlFor={id}>
                {trailing}
            </label>}
        </div>
    )
}