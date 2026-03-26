import React from "react";
import clsx from "clsx";
import CurrencyAbbreviation from "@/app/currency/CurrencyAbbreviation";
import {Skeleton} from "@radix-ui/themes";

export default function SkeletonAccountBrowser({className}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx(`relative h-full flex flex-col p-2 min-w-45`, className)}>
            {
                Array.from({length: 5}).map((_, i) => (
                    <div key={`skeleton-account-${i}`}
                         className={`relative flex items-center gap-6 md:py-2.5 md:px-3 rounded-lg hover:bg-popover-element-hover cursor-pointer hover:**:data-options:opacity-100`}>
                        <Skeleton>
                            <div
                                className={`w-full flex items-center gap-2 py-1`}>
                                <CurrencyAbbreviation className={`relative top-px text-input-text-placeholder`}
                                                      abbreviation={`1000`}/>
                                <span className={`whitespace-nowrap truncate`}>Account Name</span>
                            </div>
                        </Skeleton>
                    </div>
                ))
            }
        </div>
    );
}