import React from "react";
import clsx from "clsx";
import {LoaderCircle} from "lucide-react";

interface PrimaryButtonProps {
    title: string,
    disabled: boolean,
    loading: boolean,
}

export default function PrimaryButton({
                                          title,
                                          disabled,
                                          loading,
                                          className,
                                          ...props
                                      }: PrimaryButtonProps & React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={clsx(
                `rounded-md px-3 py-2 border border-button-border bg-button-background hover:bg-button-background-hover text-button-foreground text-sm flex items-center`,
                className,
                disabled && `bg-button-background-hover/50!`
            )}>
            <LoaderCircle size={20} className={clsx(
                `opacity-0 animate-spin w-0 mr-0`,
                loading && `opacity-100 w-5 mr-2`
            )}/>
            <span>{title}</span>
        </button>
    )
}

PrimaryButton.defaultProps = {
    disabled: false,
    loading: false
}