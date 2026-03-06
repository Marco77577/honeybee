import type {Metadata} from "next";
import {Hind_Madurai, Montserrat_Alternates} from "next/font/google";
import "./globals.css";
import Header from "@/app/components/header/Header";
import OidcProvider from "@/app/components/OidcProvider";
import {ApiProvider} from "@/app/context/api/ApiProvider";
import React from "react";
import {Theme} from "@radix-ui/themes";
import {QueryProvider} from "@/app/context/api/queries/QueryProvider";

const montserratAlternates = Montserrat_Alternates({
    variable: "--font-montserrat-alternates",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

const hindMadurai = Hind_Madurai({
    variable: "--font-hind-madurai",
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Honeybee",
    description: "Double-Entry Accounting Made Easy",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${montserratAlternates.variable} ${hindMadurai.variable} antialiased`}>
        <Theme hasBackground={false}>
            <OidcProvider>
                <ApiProvider>
                    <QueryProvider>
                        <Header/>
                        <div className={`mx-auto container`}>
                            {children}
                        </div>
                    </QueryProvider>
                </ApiProvider>
            </OidcProvider>
        </Theme>
        </body>
        </html>
    );
}