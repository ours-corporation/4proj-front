'use client';

import React from "react";
import { useState, useEffect} from "react";
import InputField from "@/src/components/auth/input/InputField";
import SubmitButton from "@/src/components/auth/button/SubmitButton";
import GlobalCard from "../card/GlobalCard";
export default function UpdateUserMailForm(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false); 
    const [error, setError] = useState("");

     const handleSubmit = async (e: { preventDefault: () => void; }) => {
       console.log("ok");
    }


    return (
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
        );
}