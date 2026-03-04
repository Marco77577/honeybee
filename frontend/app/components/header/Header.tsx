"use client"

import Honeycomb from "@/app/components/Honeycomb";
import {Cross} from 'hamburger-react'
import {useState} from "react";
import LogInButton from "@/app/components/header/LogInButton";
import SignInButton from "@/app/components/header/SignInButton";

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
                    <LogInButton/>
                    <SignInButton/>
                </div>

                {/* Mobile Menu */}
                <div className={`block md:hidden`}>
                    <div
                        className={`relative rounded-full w-10 h-10 z-10 border border-hamburger-button-border bg-hamburger-button-background hover:bg-hamburger-button-background-hover text-hamburger-button-foreground`}>
                        <div className={`absolute inset-0 -left-1 -top-1.25`}>
                            <Cross
                                size={18}
                                direction={'right'}
                                duration={0.1}
                                toggled={isMobileMenuOpen}
                                toggle={setMobileMenuOpen}/>
                        </div>
                    </div>
                </div>
            </div>
            {isMobileMenuOpen && <div className={`fixed md:hidden inset-0 bg-background px-6 pt-20`}>
                <div className={`flex flex-col gap-3`}>
                    <SignInButton/>
                    <LogInButton/>
                </div>
            </div>}
        </header>
    )
}