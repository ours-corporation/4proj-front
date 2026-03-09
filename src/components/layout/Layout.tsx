'use client';

import React from "react";
import NavBar from "@/src/components/nav/Nav";
import Headers from "@/src/components/layout/Headers";

export default function Layout({ children, currentPage }: { children: React.ReactNode, currentPage: string }) {
    return (
        <div className="flex h-screen w-full bg-main-bg dark:bg-dark-main-bg text-txt-primary dark:text-dark-txt-primary font-sans overflow-hidden">
            <NavBar currentPage={currentPage} />
            <main className="flex-1 flex flex-col min-w-0 bg-main-bg dark:bg-dark-main-bg">
                <Headers />
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}