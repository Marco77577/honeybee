import React from "react";
import clsx from "clsx";

interface Heading3Props {
    title: string,
}

export default function Heading3({
                                     title,
                                     className,
                                     ...props
                                 }: Heading3Props & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx(`flex items-center gap-3`, className)}
             {...props}>
            <h3 className={`text-xl!`}>{title}</h3>
            <div className={`flex-1 h-0.5 rounded-full bg-popover-border`}></div>
        </div>
    )
}