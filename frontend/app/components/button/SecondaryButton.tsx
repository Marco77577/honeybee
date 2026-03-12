import React from "react";
import clsx from "clsx";

interface SecondaryButtonProps {
    title: string,
}

export default function SecondaryButton({
                                            title,
                                            className,
                                            ...props
                                        }: SecondaryButtonProps & React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={clsx(`rounded-md px-3 py-2 border border-button-secondary-border bg-button-secondary-background hover:bg-button-secondary-background-hover text-button-secondary-foreground text-sm`, className)}>
            <span>{title}</span>
        </button>
    )
}