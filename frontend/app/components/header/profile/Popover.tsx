import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import clsx from "clsx";

interface PopoverProvider {
    isOpen: boolean,
    close: () => void,
    open: () => void,
}

export const PopoverContext = createContext<PopoverProvider>({
    isOpen: false,
    close: () => {
    },
    open: () => {
    },
});

interface ChildProps {
    children: React.ReactNode,
    align?: "left" | "right";
    immediate?: boolean;
}

export function Popover({
                            children,
                            immediate = false
                        }: ChildProps) {
    const [isOpen, setIsOpen] = useState(immediate);

    const close = () => setIsOpen(false);
    const open = () => setIsOpen(true);

    return (
        <PopoverContext.Provider value={{isOpen, close, open}}>
            <div className={`relative`}>
                {children}
            </div>
        </PopoverContext.Provider>
    );
}

Popover.Trigger = function PopoverTrigger({children, ...props}: ChildProps & React.HTMLAttributes<HTMLDivElement>) {
    const {open} = useContext(PopoverContext);

    return (
        <div className={`contents`}
             onClick={e => {
                 e.stopPropagation();
                 open();
             }} {...props}>
            {children}
        </div>
    );
};

Popover.Content = function PopoverContent({
                                              children,
                                              align = 'left',
                                              className,
                                              ...props
                                          }: ChildProps & React.HTMLAttributes<HTMLDivElement>) {
    const ref = useRef<HTMLDivElement>(null);
    const {isOpen, open, close} = useContext(PopoverContext);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };

        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, close]);

    useEffect(() => {
        if (!isOpen) return;
        const element = ref.current;
        if (!element) return;

        const focusable = element.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusable?.focus();
    }, [isOpen]);

    useEffect(
        () => {
            function handleClickOutside(event: MouseEvent) {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    close();
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        },
        []
    );

    if (!open) return null;

    return (
        <div ref={ref}
             className={clsx(
                 "absolute top-full w-max opacity-0 mt-0 bg-popover-background border border-popover-border rounded-xl pointer-events-none transition-all",
                 className,
                 align === "right" ? "right-0" : "left-0",
                 isOpen && "opacity-100 mt-3 pointer-events-auto! z-20"
             )}
             {...props}>
            {children}
        </div>
    );
};