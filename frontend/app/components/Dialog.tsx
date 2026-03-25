import React, {createContext, useContext, useState} from "react";
import clsx from "clsx";
import {createPortal} from "react-dom";

interface DialogProvider {
    isOpen: boolean,
    close: () => void,
    open: () => void,
}

export const DialogContext = createContext<DialogProvider>({
    isOpen: false,
    close: () => {
    },
    open: () => {
    },
});

interface ChildProps {
    children: React.ReactNode,
}

export function Dialog({children}: ChildProps) {
    const [isOpen, setIsOpen] = useState(false);

    const close = () => setIsOpen(false);
    const open = () => setIsOpen(true);

    return (
        <DialogContext.Provider value={{isOpen, close, open}}>
            {children}
        </DialogContext.Provider>
    );
}

Dialog.Trigger = function DialogTrigger({children, ...props}: ChildProps & React.HTMLAttributes<HTMLDivElement>) {
    const {open} = useContext(DialogContext);

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

Dialog.Content = function DialogContent({
                                            children,
                                            className,
                                            ...props
                                        }: ChildProps & React.HTMLAttributes<HTMLDivElement>) {
    const {isOpen, open, close} = useContext(DialogContext);

    if (!open) return null;

    return createPortal(
        <div
            {...props}
            onClick={e => {
                e.stopPropagation();
                close();
            }}
            className={clsx(
                `fixed inset-0 p-3 z-10 bg-black/50 flex items-center justify-center cursor-auto`,
                !isOpen && `hidden`,
                isOpen && `flex`,
                className)}>
            <div className={`w-full max-w-xl mx-auto flex flex-col gap-3`}>
                <div
                    onClick={e => e.stopPropagation()}
                    className={`rounded-lg p-2 px-5 bg-input-text-background border border-input-text-border text-input-text-foreground outline-3 outline-transparent hover:outline-input-text-border-outline`}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};