import {LucideIcon} from "lucide-react";
import React from "react";
import clsx from "clsx";

interface ComboIconProps {
    main: LucideIcon,
    mainSize: number,
    mainStrokeWidth: number,
    secondary: LucideIcon,
    secondarySize: number,
    secondaryStrokeWidth: number,
}

export default function ComboIcon({
                                      main: MainIcon,
                                      mainSize = 20,
                                      mainStrokeWidth = 1,
                                      secondary: SecondaryIcon,
                                      secondarySize = 10,
                                      secondaryStrokeWidth = 1,
                                      className,
                                      ...props
                                  }: ComboIconProps & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx(`relative`, className)} {...props}>
            <MainIcon size={mainSize}
                      strokeWidth={mainStrokeWidth}/>
            <div
                className={`absolute -bottom-1 -right-1 rounded-full bg-popover-element-hover border border-popover-border`}>
                <SecondaryIcon size={secondarySize}
                               strokeWidth={secondaryStrokeWidth}/>
            </div>
        </div>
    );
}