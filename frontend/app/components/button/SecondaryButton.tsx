import React from "react";
import clsx from "clsx";
import {LoaderCircle} from "lucide-react";

interface SecondaryButtonProps {
    title: string,
    loading: boolean,
}

export default function SecondaryButton({
                                            title,
                                            loading,
                                            className,
                                            ...props
                                        }: SecondaryButtonProps & React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={clsx(`rounded-md px-3 py-2 border border-button-secondary-border bg-button-secondary-background hover:bg-button-secondary-background-hover text-button-secondary-foreground text-sm  flex items-center`, className)}>
            <LoaderCircle size={20} className={clsx(
                `opacity-0 animate-spin w-0 mr-0`,
                loading && `opacity-100 w-5 mr-2`
            )}/>
            <span>{title}</span>
        </button>
    )
}

SecondaryButton.defaultProps = {
    loading: false
}