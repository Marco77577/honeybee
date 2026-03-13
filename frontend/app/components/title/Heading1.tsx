import React, {ReactElement} from "react";
import clsx from "clsx";

interface Heading1Props {
    title: string,
    icon: ReactElement
}

export default function Heading1({
                                     title,
                                     icon,
                                     className,
                                     ...props
                                 }: Heading1Props & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx(`flex flex-col gap-3`, className)}
             {...props}>
            {icon}
            <h1>{title}</h1>
        </div>
    )
}