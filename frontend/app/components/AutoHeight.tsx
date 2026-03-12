import React, {ReactNode, useLayoutEffect, useRef, useState} from "react";
import clsx from "clsx";

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
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;

        const updateHeight = () => setHeight(element.scrollHeight);

        updateHeight();
        const observer = new ResizeObserver(() => updateHeight());
        observer.observe(element);

        return () => observer.disconnect();
    }, [children]);

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