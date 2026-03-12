import React, {ReactNode} from "react";
import clsx from "clsx";
import {useMeasure} from "react-use";

interface AutoHeightProps {
    children: ReactNode;
    open: boolean;
}

export function AutoHeight({
                               children,
                               open,
                               className,
                               ...props
                           }: AutoHeightProps & React.HTMLAttributes<HTMLDivElement>) {
    const [ref, {height}] = useMeasure();

    return (
        <div
            {...props}
            className={clsx(
                `overflow-hidden p-2 -m-2 transition-all duration-500`,
                open && `pointer-events-auto opacity-100`,
                !open && `pointer-events-none opacity-0`,
                className
            )}
            style={{height: open ? `${height}px` : "0px"}}>
            <div ref={ref} className={clsx(
                `p-2 -m-2 transition-all duration-500`,
                open && `pointer-events-auto opacity-100 mt-0`,
                !open && `pointer-events-none opacity-0 -mt-3`,
            )}>
                {children}
            </div>
        </div>
    );
}