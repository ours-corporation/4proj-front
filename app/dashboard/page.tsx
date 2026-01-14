'use client';

import { useAuth } from "@/src/hooks/useAuth";
import Loading from "@/components/loading";

export default function Dashboard() {

    //--------protection de vérification d'authentification---------
    const loading = useAuth();
    //--------------------------------------------------------------
    if (loading) return <Loading />;

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                    Welcome to your Dashboard
                </h1>
            </main>
        </div>
    );
}
