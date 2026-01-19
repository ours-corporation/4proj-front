'use client';
/*import React, {useEffect} from "react";*/

import { useState, useEffect} from "react";
import Layout from '@/src/components/Layout';
import {useJwtInformation} from "@/src/hooks/getJwtInformation";
import GlobalCard from "@/src/components/card/GlobalCard";
import InputField from "@/src/components/auth/input/InputField";
import SubmitButton from "@/src/components/auth/button/SubmitButton";
import {useAuth} from "@/src/hooks/useAuth";
import Loading from '@/src/components/Loading';
import { getMyInformation } from "@/src/api/user";

export default function SettingsPage() {


    const userInfo = useJwtInformation();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const loading = useAuth();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [ error, setError ] = useState<boolean>(false);
    useEffect(() => {
        async function fetchUserData() {
            try {
                const data = await getMyInformation();
                if (data) {
                   const email = data.email;
                   setEmail(email);
                   const username = userInfo.username;
                   setUsername(username);
                } else {
                    setError(true);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
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
                  svgIcon={ <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5E81F4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"/>
                        </svg>}> 
                {userInfo ? userInfo.username : 'Utilisateur'}
                <p>menbre depuis </p>
                <hr></hr>
                <p>Plan premium 30go</p>
            </GlobalCard> 

            <GlobalCard>
                Détails du stockages

                Vidéos

                Documents

                Libre
            </GlobalCard> 

            <GlobalCard>
                <h1 className='text-3xl font-bold text-txt-primary dark:text-dark-txt-primary mb-2'> Informations personnelles</h1>
                <InputField
                    id="username"
                    name="username"
                    label="Nom complet"
                    value={username}
                    type="text"
                    onChange={setUsername}
                />

                <InputField
                    id="email"
                    name="email"
                    label="Adresse Email"
                    value={email}
                    type="email"
                    onChange={setEmail}
                />

               <SubmitButton
                    id="change-button"
                    type="submit"
                    text="Enregistrer les modifications"
                    loading={loading}
                    loadingText="Enregistrement..."
                />
            </GlobalCard> 

            <GlobalCard>
                <h1 className='text-3xl font-bold text-txt-primary dark:text-dark-txt-primary mb-2'> Sécurité</h1>
                 <InputField
                    id="password"
                    name="password"
                    label="Mot de passe actuel"
                    value={password}
                    type="password"
                    onChange={setPassword}
                />

                <InputField
                    id="password"
                    name="password"
                    label="Nouveau mot de passe"
                    value={password}
                    type="password"
                    onChange={setPassword}
                />

                <InputField
                    id="confirm-password"
                    name="confirm-password"
                    label="Confirmer"
                    value={confirmPassword}
                    type="password"
                    onChange={setConfirmPassword}
                />

               <SubmitButton
                    id="change-button"
                    type="submit"
                    text="Mettre à jour le mot de passe"
                    loading={loading}
                    loadingText="Enregistrement..."
                />
            </GlobalCard> 
        </Layout>
    );

}