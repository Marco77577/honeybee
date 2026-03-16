import React from "react";
import clsx from "clsx";

interface PrimaryButtonProps {
    title: string,
    disabled: boolean,
}

export default function PrimaryButton({
                                          title,
                                          disabled,
                                          className,
                                          ...props
                                      }: PrimaryButtonProps & React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={clsx(
                `rounded-md px-3 py-2 border border-button-border bg-button-background hover:bg-button-background-hover text-button-foreground text-sm`,
                className,
                disabled && `bg-button-background-hover/50!`
            )}>
            <span>{title}</span>
        </button>
    )
}

PrimaryButton.defaultProps = {
    disabled: false
}