'use client';

import { useState, useEffect} from "react";
import Layout from '@/src/components/Layout';
import {useJwtInformation} from "@/src/hooks/getJwtInformation";
import GlobalCard from "@/src/components/card/GlobalCard";
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
                                 const date = data.createdAt;
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



    if (loading) return <Loading />;

    return (
        <Layout currentPage="/settings">
            <main>
            <h1 className='text-3xl font-bold text-txt-primary dark:text-dark-txt-primary mb-2'> Paramètres du compte </h1>
            </main>
            <GlobalCard
            svgIcon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

            }
            >
                {username ? username : 'Utilisateur'}
                <p>menbre depuis {accountCreationDate ? accountCreationDate.slice(0,4) : '2025'}</p>
                <hr></hr>
                <p>Plan premium 30go</p>
            </GlobalCard> 

            <GlobalCard
            svgIcon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                </svg>
            }
            >
                
                <p className="text-txt-secondary dark:text-dark-txt-secondary mb-8"> Détails du stockages </p>
                <ul>
                    <li>
                    Vidéos
                    </li>
                    <li>
                    Documents
                    </li>
                    <li>
                    Libre
                    </li>
                </ul>
            </GlobalCard> 

        <UpdateUserMailForm></UpdateUserMailForm>   

        <UpdatePasswordForm></UpdatePasswordForm>

        </Layout>
    );

}