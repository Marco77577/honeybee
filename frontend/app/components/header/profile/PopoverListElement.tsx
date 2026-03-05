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
            className={clsx(`p-2`, color ? `text-${color} hover:text-white` : `text-popover-foreground`, className)}
            {...props}>
            <div
                className={clsx(`flex items-center gap-3 py-2.5 px-2 rounded-md cursor-pointer`, color ? `hover:bg-${color}` : `hover:bg-popover-element-hover`)}>
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