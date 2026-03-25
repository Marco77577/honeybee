import React, {ReactNode, useLayoutEffect, useState} from "react";
import clsx from "clsx";
import {useMeasure} from "react-use";

interface AutoHeightProps {
    children: ReactNode;
    open: boolean;
    allowOverflow?: boolean;
}

export function AutoHeight({
                               children,
                               open,
                               allowOverflow = false,
                               className,
                               ...props
                           }: AutoHeightProps & React.HTMLAttributes<HTMLDivElement>) {
    const [ref, {height: measuredHeight}] = useMeasure();
    const [height, setHeight] = useState(`0px`);

    useLayoutEffect(() => {
        if (open && height !== `auto`) {
            setHeight(`${measuredHeight}px`);
        } else if (!open) {
            setHeight(`${measuredHeight}px`);
            requestAnimationFrame(() => {
                setHeight(`0px`);
            });
        }
    }, [open, measuredHeight]);

    return (
        <div
            {...props}
            className={clsx(
                `overflow-hidden transition-all duration-500`,
                allowOverflow && `px-2 -mx-2`,
                open && `pointer-events-auto opacity-100`,
                !open && `pointer-events-none opacity-0`,
                className
            )}
            style={{height: height}}
            onTransitionEnd={() => setHeight(open ? `auto` : `0px`)}>
            <div ref={ref} className={clsx(
                `transition-all duration-500`,
                open && `pointer-events-auto opacity-100 mt-0`,
                !open && `pointer-events-none opacity-0 -mt-9`,
            )}>
                <div className={clsx(allowOverflow && `px-2 -mx-2 py-2`)}>
                    {open && children}
                </div>
            </div>
        </div>
    );
}