import React from "react";

export type HoneycombProps = React.SVGProps<SVGSVGElement> & {
    outline?: boolean;
    strokeWidth?: number
};

export default function Honeycomb({
                                      outline = true,
                                      strokeWidth = 1,
                                      ...props
                                  }: HoneycombProps) {
    const strokeWidthCalc = outline ? strokeWidth / 2 : 0
    return (
        <svg
            viewBox={`${0 - strokeWidthCalc} ${20 - strokeWidthCalc} ${300 + strokeWidthCalc * 4} ${260 + strokeWidthCalc * 4}`}
            fill="currentColor"
            {...props}
        >
            <polygon
                points="300,150 225,280 75,280 0,150 75,20 225,20"
                fill={outline ? "none" : "currentColor"}
                stroke={outline ? "currentColor" : "none"}
                strokeWidth={outline ? strokeWidth : undefined}
            />
        </svg>
    )
}