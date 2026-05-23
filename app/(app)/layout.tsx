'use client';

import React from "react";
import { useAuth } from "@/src/hooks/useAuth";
import Loading from "@/src/components/Loading";
import NavBar from "@/src/components/nav/Nav";
import Headers from "@/src/components/layout/Headers";
import { ProfilePictureProvider } from "@/src/context/ProfilePictureContext";
import { ToastProvider } from "@/src/context/ToastContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const loading = useAuth();

    return (
        <ToastProvider>
        <ProfilePictureProvider>
            <div className="flex h-screen w-full bg-main-bg dark:bg-[#0d0d0d] overflow-hidden">
                <NavBar />
                <main className="flex-1 flex flex-col min-w-0">
                    <Headers />
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {loading ? <Loading /> : children}
                    </div>
                </main>
            </div>
        </ProfilePictureProvider>
        </ToastProvider>
    );
}
