'use client';

import { useState, useEffect} from "react";
import Layout from '@/src/components/Layout';
import {useJwtInformation} from "@/src/hooks/getJwtInformation";
import GlobalCard from "@/src/components/card/GlobalCard";
import InputField from "@/src/components/auth/input/InputField";
import SubmitButton from "@/src/components/auth/button/SubmitButton";
/*import {useAuth} from "@/src/hooks/useAuth";*/
import Loading from '@/src/components/Loading';
import { getMyInformation, updateUser } from "@/src/api/user";

export default function SettingsPage() {

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const userInfo = useJwtInformation();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [pageLoading, setPageLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false); 
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSubmitLoading(true);

        try{
            const response = await updateUser(username, email);
            console.log("MAJ réussie -> ", response)
            return;
        }

        catch(err){
            console.log(err)
        }

        finally{
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        async function fetchUserData() {
            try {
                const data = await getMyInformation();
                if (data) {
                    const email = data.email;
                    setEmail(email);
                    const username = userInfo.username;
                    setUsername(username);
                    /*const updatedUser = await updateUser(username, email);*/
                    console.log("mise a jour réussie ");
                } else {
                    setError("les informations n'ont pas réussi à être récupéré");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        fetchUserData();
    }, []);


        

    if (pageLoading) return <Loading />;

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
                {userInfo ? userInfo.username : 'Utilisateur'}
                <p>menbre depuis </p>
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
                Détails du stockages

                Vidéos

                Documents

                Libre
            </GlobalCard> 

            <GlobalCard
            svgIcon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
            }
            >
                <form onSubmit={handleSubmit}>
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

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}

               <SubmitButton
                    id="change-button"
                    type="submit"
                    text="Enregistrer les modifications"
                    loading={submitLoading}
                    loadingText="Enregistrement..."
                />
                </form>
            </GlobalCard> 

            <GlobalCard
            svgIcon={ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>}
            >
                <form>
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
                    loading={submitLoading}
                    loadingText="Enregistrement..."
                />
                </form>
            </GlobalCard> 
        </Layout>
    );

}