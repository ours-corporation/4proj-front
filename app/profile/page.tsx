'use client';

import { useState, useEffect} from "react";
import Layout from '@/src/components/Layout';
import {useJwtInformation} from "@/src/hooks/getJwtInformation";
import Loading from '@/src/components/Loading';
import { getMyInformation } from "@/src/api/user";

import UpdateUserMailForm from "@/src/components/settings/UpdateUserMailForm";
import UpdatePasswordForm from "@/src/components/settings/UpdatePasswordForm";

import { useAuth } from '@/src/hooks/useAuth';

export default function SettingsPage() {

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const userInfo = useJwtInformation();

    const loading = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [accountCreationDate, setAccountCreationDate] = useState("");
    const [error, setError] = useState("");

     useEffect(() => {
                     async function fetchUserData() {
                         try {
                             const data = await getMyInformation();
                             if (data) {
                                 console.log(data);
                                 const email = data.email;
                                 setEmail(email);
                                 const username = data.username;
                                 setUsername(username);
                                 const date = data.created_at;
                                 setAccountCreationDate(date);
                                 console.log("mise a jour réussie ");
                             } else {
                                 setError("les informations n'ont pas réussi à être récupéré");
                             }
                         } catch (error) {
                             console.log(error);
                         }
                     }

                     fetchUserData();
                 }, []);

    const initials = username
        ? username.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    const memberYear = accountCreationDate ? accountCreationDate.slice(0, 4) : "2025";

    if (loading) return <Loading />;

    return (
        <Layout currentPage="/settings">
            <main>
                <h1 className='text-3xl font-bold text-txt-primary dark:text-dark-txt-primary mb-6'>
                    Paramètres du compte
                </h1>
            </main>

            <section className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-6 pr-6 items-start">

                {/* Carte profil */}
                <div className="w-full bg-surface dark:bg-dark-surface p-6 rounded-[30px] shadow-xl text-txt-primary dark:text-dark-txt-primary font-sans">
                    {/* Avatar avec initiales */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="h-20 w-20 bg-main-bg dark:bg-dark-main-bg rounded-2xl flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-txt-primary dark:text-dark-txt-primary select-none">
                                {initials}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-txt-primary dark:text-dark-txt-primary text-center leading-tight">
                            {username || "Utilisateur"}
                        </h2>
                        <p className="text-sm text-txt-primary/60 dark:text-dark-txt-primary/60 mt-1">
                            Membre depuis {memberYear}
                        </p>
                    </div>

                    {/* Séparateur */}
                    <div className="border-t border-txt-primary/10 dark:border-dark-txt-primary/10 mb-4" />

                    {/* Badge plan */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-main-bg dark:bg-dark-main-bg rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 text-txt-primary dark:text-dark-txt-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                        <div>
                            <p className="text-xs font-semibold text-txt-primary dark:text-dark-txt-primary">Plan Premium</p>
                            <p className="text-xs text-txt-primary/60 dark:text-dark-txt-primary/60">30 Go de stockage</p>
                        </div>
                    </div>
                </div>

                <UpdateUserMailForm />

                {/* Carte stockage */}
                <div className="w-full bg-surface dark:bg-dark-surface p-6 rounded-[30px] shadow-xl font-sans">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-main-bg dark:bg-dark-main-bg rounded-xl flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-txt-primary dark:text-dark-txt-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-txt-primary dark:text-dark-txt-primary">
                            Détails du stockage
                        </h2>
                    </div>

                    <ul className="space-y-3">
                        {[
                            { label: "Vidéos", icon: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" },
                            { label: "Documents", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
                            { label: "Libre", icon: "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" },
                        ].map(({ label, icon }) => (
                            <li key={label} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-main-bg dark:bg-dark-main-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 text-txt-primary dark:text-dark-txt-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                                </svg>
                                <span className="text-sm text-txt-primary dark:text-dark-txt-primary">{label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <UpdatePasswordForm />
            </section>
        </Layout>
    );

}
