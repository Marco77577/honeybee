import React, * as react from "react";
import {LucideProps} from "lucide-react";
import clsx from "clsx";

type LucideIcon = react.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>

interface PopoverListElementProps {
    title: string,
    icon: LucideIcon,
    subtitle?: string,
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

export default function PopoverListElement({
                                               title,
                                               icon: Icon,
                                               subtitle,
                                               className,
                                               color,
                                               ...props
                                           }: PopoverListElementProps & React.HTMLAttributes<HTMLDivElement>) {

    return (
        <div
            className={clsx(`p-2`, color ? `${colorMap.text[color]} hover:text-white` : `text-popover-foreground`, className)}
            {...props}>
            <div
                className={clsx(`flex items-center gap-4 py-2.5 px-2 rounded-md cursor-pointer`, color ? colorMap.hover[color] : `hover:bg-popover-element-hover`)}>
                <div>
                    <Icon/>
                </div>
                <div className={`flex flex-col flex-1`}>
                    <div className={clsx(`font-bold text-sm`, !color && `text-popover-foreground-title`)}>{title}</div>
                    {subtitle && <div className={`text-[13px]`}>{subtitle}</div>}
                </div>
            </div>
        </div>
    )
}