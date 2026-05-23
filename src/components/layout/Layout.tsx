'use client';

import React from "react";
import NavBar from "@/src/components/nav/Nav";
import Headers from "@/src/components/layout/Headers";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-main-bg dark:bg-[#0d0d0d] overflow-hidden">
            <NavBar />
            <main className="flex-1 flex flex-col min-w-0">
                <Headers />
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
