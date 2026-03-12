import React from "react";
import clsx from "clsx";

interface PopoverSimpleListElementProps {
    title: string,
    color?: string,
}

const colorMap: Record<string, Record<string, string>> = {
    text: {
        error: `text-error`,
    },
    hover: {
        error: `hover:bg-error`,
    }
}

export default function PopoverSimpleListElement({
                                                     title,
                                                     className,
                                                     color,
                                                     ...props
                                                 }: PopoverSimpleListElementProps & React.HTMLAttributes<HTMLDivElement>) {

    return (
        <div
            className={clsx(`p-1`, color ? `${colorMap.text[color]} hover:text-white` : `text-popover-foreground`, className)}
            {...props}>
            <div
                className={clsx(`flex items-center gap-3 py-1.5 px-2 rounded-md cursor-pointer`, color ? colorMap.hover[color] : `hover:bg-popover-element-hover`)}>
                <div className={clsx(`text-sm`, !color && `text-popover-foreground-title`)}>{title}</div>
            </div>
        </div>
    )
}