'use client';

import React from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import Loading from '@/components/Loading';
import Headers from '@/components/Headers';
import NavBar from "@/components/nav/Nav";

export default function Dashboard() {

    //--------protection de vérification d'authentification---------
    const loading = useAuth();
    //--------------------------------------------------------------

    if (loading) return <Loading />;

    return (
        <div className="flex h-screen w-full bg-[#0b0e1e] text-white font-sans overflow-hidden">
            <NavBar currentPage="/dashboard" />
            <main className="flex-1 flex flex-col min-w-0 bg-[#0b0e1e]">
                <Headers />
                <div className="flex-1 overflow-y-auto p-6 md:p-8">

                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome to your Dashboard
                    </h1>
                    <p className="text-gray-400 mb-8">Retrouvez vos fichiers récents et dossiers partagés.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="h-40 bg-[#161b2e] rounded-2xl border border-gray-800 p-4">Dossier 1</div>
                        <div className="h-40 bg-[#161b2e] rounded-2xl border border-gray-800 p-4">Dossier 2</div>
                        <div className="h-40 bg-[#161b2e] rounded-2xl border border-gray-800 p-4">Dossier 3</div>
                    </div>

                </div>
            </main>
        </div>
    );
}