import React from "react";
import clsx from "clsx";
import {FolderOpen} from "lucide-react";
import {Skeleton} from "@radix-ui/themes";


export default function SkeletonCategoryBrowser({className}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx(`flex flex-col p-2 min-w-45`, className)}>
            {
                Array.from({length: 5}).map((_, i) => (
                    <div key={`skeleton-category-${i}`}
                         className={`relative flex items-center gap-6 md:py-2.5 md:px-3 rounded-lg`}
                         style={{paddingLeft: `${10 * (i === 0 ? 0 : 2)}px`}}>
                        <Skeleton>
                            <div className={`w-full flex items-center gap-2 py-1`}>
                                <FolderOpen size={20} strokeWidth={1}/>
                                <span className={`whitespace-nowrap truncate max-w-37.5`}>Category Name</span>
                            </div>
                        </Skeleton>
                    </div>
                ))
            }
        </div>
    )
}