'use client';

import { useState, useEffect } from "react";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";
import GlobalCard from "../card/GlobalCard";
import { getMyInformation, updateUser } from "@/src/api/user";

export default function UpdateUserMailForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const emailChanged = email !== originalEmail;

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setSubmitLoading(true);
        setError("");
        setSuccess(false);

        try {
            await updateUser(username, email, emailChanged ? password : undefined);
            setSuccess(true);
            setOriginalEmail(email);
            setPassword("");
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de la mise à jour.");
        } finally {
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        async function fetchUserData() {
            try {
                const data = await getMyInformation();
                if (data) {
                    setEmail(data.email);
                    setOriginalEmail(data.email);
                    setUsername(data.username);
                } else {
                    setError("Les informations n'ont pas pu être récupérées.");
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserData();
    }, []);

    return (
        <GlobalCard
            iconBg="bg-blue-500/10 dark:bg-blue-400/10"
            svgIcon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500 dark:text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
            }
        >
            <form onSubmit={handleSubmit}>
                <h1 className="text-3xl font-bold text-txt-primary dark:text-dark-txt-primary mb-4">Informations personnelles</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        id="username"
                        name="username"
                        label="Nom d'utilisateur"
                        value={username}
                        type="text"
                        onChange={setUsername}
                    />

                    <InputField
                        id="email"
                        name="email"
                        label="Adresse e-mail"
                        value={email}
                        type="email"
                        onChange={setEmail}
                    />

                    {emailChanged && (
                        <div className="md:col-span-2">
                            <InputField
                                id="password-confirm"
                                name="password-confirm"
                                label="Mot de passe actuel (requis pour changer l'e-mail)"
                                value={password}
                                type="password"
                                onChange={setPassword}
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-error dark:text-dark-error col-span-full">{error}</p>
                    )}
                    {success && (
                        <p className="text-sm text-green-600 dark:text-green-400 col-span-full">Modifications enregistrées.</p>
                    )}

                    <div className="md:col-span-2">
                        <SubmitButton
                            id="change-button"
                            type="submit"
                            text="Enregistrer les modifications"
                            loading={submitLoading}
                            loadingText="Enregistrement..."
                        />
                    </div>
                </div>
            </form>
        </GlobalCard>
    );
}
