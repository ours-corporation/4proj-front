'use client';

import React from "react";
import { useState, useEffect} from "react";
import InputField from "@/src/components/auth/input/InputField";
import SubmitButton from "@/src/components/auth/button/SubmitButton";
import GlobalCard from "../card/GlobalCard";

export default function UpdateUserMailForm(){
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);

     const handleSubmitPassword = async (e: { preventDefault: () => void; }) => {
       console.log("ok");
    }


    return (
        <GlobalCard
                    svgIcon={ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>}>
        <form onSubmit={handleSubmitPassword}>
            <h1 className='text-3xl font-bold text-txt-primary dark:text-dark-txt-primary mb-2'> Sécurité</h1>
                <InputField
                id="password"
                name="password"
                label="Mot de passe actuel"
                value={oldPassword}
                type="password"
                onChange={setOldPassword}
            />

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

            <SubmitButton
                id="change-button"
                type="submit"
                text="Mettre à jour le mot de passe"
                loading={submitLoading}
                loadingText="Enregistrement..."
            />
            </form>
        </GlobalCard> 
        );
}