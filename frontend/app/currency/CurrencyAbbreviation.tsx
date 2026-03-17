import React from "react";
import clsx from "clsx";

interface CurrencyAbbreviationProps {
    abbreviation?: string,
}

export default function CurrencyAbbreviation({
                                                 abbreviation,
                                                 className,
                                                 ...props
                                             }: CurrencyAbbreviationProps & React.HTMLAttributes<HTMLSpanElement>) {
    return <span className={clsx(`font-mono! text-sm`, className)}
                 {...props}>{abbreviation}</span>
}