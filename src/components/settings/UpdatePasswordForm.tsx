'use client';

import React from "react";
import { useState, useEffect} from "react";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";
import GlobalCard from "../card/GlobalCard";
import { updatePassword } from "@/src/api/user";


export default function UpdateUserMailForm(){
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

     const handleSubmitPassword = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try{
            if (newPassword !== confirmPassword) {
                setError("Les mots de passe ne correspondent pas.");
                setLoading(false);
                return;
            }
        
        const res = await updatePassword(oldPassword, newPassword); 

        }
        catch(err){
            console.error("error updating the password:", error);
        }

        finally{
            setLoading(false);
        }
    };


    return (
        <GlobalCard
                    svgIcon={ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-txt-primary dark:text-dark-txt-primary">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>}>
        <form onSubmit={handleSubmitPassword}>
            <h1 className='text-3xl font-bold text-txt-primary dark:text-dark-txt-primary mb-2'> Sécurité</h1>
            <div>
            <InputField
                id="password"
                name="password"
                label="Mot de passe actuel"
                value={oldPassword}
                type="password"
                onChange={setOldPassword}
            />
            </div>
            <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <InputField
                id="password"
                name="password"
                label="Nouveau mot de passe"
                value={newPassword}
                type="password"
                onChange={setNewPassword}
            />

            <InputField
                id="confirm-password"
                name="confirm-password"
                label="Confirmer"
                value={confirmPassword}
                type="password"
                onChange={setConfirmPassword}
            />
            </div>
            {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            </div>
            <div>
            <SubmitButton
                id="change-button"
                type="submit"
                text="Mettre à jour le mot de passe"
                loading={loading}
                loadingText="Enregistrement..."
            />
            </div>
        </form>
        </GlobalCard> 
        );
}