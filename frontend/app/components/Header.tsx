"use client"

import Honeycomb from "@/app/components/Honeycomb";
import {Cross} from 'hamburger-react'
import {useState} from "react";

export default function Header() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className={`px-6`}>
            <div className={`mx-auto container flex items-center justify-between py-4`}>
                <div className={`flex items-center gap-3`}>
                    <Honeycomb strokeWidth={8} className={`h-8 text-honey`}/>
                    <h1 className={`text-3xl`}>honeybee</h1>
                </div>

                {/* Desktop Menu */}
                <div className={`hidden md:flex items-center gap-3`}>
                    <button
                        className={`rounded-md px-3 py-2 border border-button-secondary-border bg-button-secondary-background hover:bg-button-secondary-background-hover text-button-secondary-foreground text-sm`}>Log
                        In
                    </button>
                    <button
                        className={`rounded-md px-3 py-2 border border-button-border bg-button-background hover:bg-button-background-hover text-button-foreground text-sm`}>Sign
                        Up
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`block md:hidden`}>
                    <div
                        className={`relative rounded-full w-10 h-10 border border-hamburger-button-border bg-hamburger-button-background hover:bg-hamburger-button-background-hover text-hamburger-button-foreground`}>
                        <div className={`absolute inset-0 -left-1 -top-1.25`}>
                            <Cross
                                size={18}
                                direction={'right'}
                                duration={0.1}
                                toggled={isMobileMenuOpen}
                                toggle={setMobileMenuOpen}/>
                        </div>
                    </div>
                    {/*{isMobileMenuOpen && <div className="mobile-menu">Menu items</div>}*/}
                </div>
            </div>
        </header>
    )
}