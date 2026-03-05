import React, {cloneElement, ReactElement, ReactNode, useEffect, useRef, useState} from "react";
import clsx from "clsx";

interface PopoverProps {
    trigger: ReactElement<{ onClick?: () => void }>;
    children: ReactNode;
    align?: "left" | "right";
    alwaysOpen: boolean;
}

export function Popover({trigger, children, align = "right", alwaysOpen = false}: PopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(
        () => {
            function handleClickOutside(event: MouseEvent) {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        },
        []
    );

    const triggerWithHandler = cloneElement(trigger, {
        onClick: () => setIsOpen((prev) => !prev),
    });

    return (
        <div className="w-full relative" ref={ref}>
            {triggerWithHandler}
            <div
                className={clsx(
                    "absolute top-full w-max opacity-0 mt-0 bg-popover-background border border-popover-border rounded-xl pointer-events-none transition-all",
                    alwaysOpen && "static w-full!",
                    align === "right" ? "right-0" : "left-0",
                    (isOpen || alwaysOpen) && "opacity-100 mt-3 pointer-events-auto!"
                )}
            >
                {children}
            </div>
        </div>
    );
}