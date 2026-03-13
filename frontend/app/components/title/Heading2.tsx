import React, {ReactElement} from "react";
import clsx from "clsx";

interface Heading2Props {
    title: string,
    icon: ReactElement
}

export default function Heading2({
                                     title,
                                     icon,
                                     className,
                                     ...props
                                 }: Heading2Props & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx(`flex flex-col gap-3`, className)}
             {...props}>
            {icon}
            <h2 className={`text-2xl!`}>{title}</h2>
        </div>
    )
}