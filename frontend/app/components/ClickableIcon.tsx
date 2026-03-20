import React, {ReactNode} from "react";
import clsx from "clsx";

interface ClickableIconProps {
    children: ReactNode;
}

export default function ClickableIcon({
                                          children,
                                          className,
                                          ...props
                                      }: ClickableIconProps & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            tabIndex={0}
            onKeyDown={e => e.key === `Enter` && e.currentTarget.click()}
            className={clsx(`inline-block rounded-md cursor-pointer p-2 hover:bg-input-text-border-outline`, className)}>
            {children}
        </div>
    );
}