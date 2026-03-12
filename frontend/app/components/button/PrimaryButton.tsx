import React from "react";
import clsx from "clsx";

interface PrimaryButtonProps {
    title: string,
}

export default function PrimaryButton({
                                          title,
                                          className,
                                          ...props
                                      }: PrimaryButtonProps & React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={clsx(`rounded-md px-3 py-2 border border-button-border bg-button-background hover:bg-button-background-hover text-button-foreground text-sm`, className)}>
            <span>{title}</span>
        </button>
    )
}