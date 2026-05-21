'use client';

import { useState, useEffect } from "react";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";
import { getMyInformation, updateUser } from "@/src/api/user";

const iw = "mt-1 w-full bg-input-bg dark:bg-[#0d0d0d] border border-border-subtle dark:border-white/[0.08] rounded-[10px] px-4 py-3 flex items-center transition-all focus-within:border-[#7c6ef8]/50 focus-within:ring-1 focus-within:ring-[#7c6ef8]/20";
const ii = "flex-grow bg-transparent focus:outline-none p-0 border-none ring-0 text-txt-primary dark:text-[#ededed] text-sm placeholder:text-[#9CA3AF] dark:placeholder:text-[#333]";
const lc = "block text-[11px] font-medium text-txt-secondary dark:text-[#555] mb-1.5 uppercase tracking-wider";

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
        getMyInformation().then(data => {
            if (data) { setEmail(data.email); setOriginalEmail(data.email); setUsername(data.username); }
        }).catch(console.log);
    }, []);

    return (
        <div className="bg-surface dark:bg-[#111113] border border-border-subtle dark:border-white/[0.06] rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-none">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[#7c6ef8]/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#7c6ef8" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-[15px] font-semibold text-txt-primary dark:text-[#ededed]">Informations personnelles</h2>
                    <p className="text-[12px] text-txt-secondary dark:text-[#444]">Nom d'utilisateur et adresse e-mail</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField id="username" name="username" label="Nom d'utilisateur" value={username} type="text" onChange={setUsername} labelClassName={lc} wrapperClassName={iw} inputClassName={ii} />
                    <InputField id="email" name="email" label="Adresse e-mail" value={email} type="email" onChange={setEmail} labelClassName={lc} wrapperClassName={iw} inputClassName={ii} />
                </div>

                {emailChanged && (
                    <InputField
                        id="password-confirm"
                        name="password-confirm"
                        label="Mot de passe actuel (requis pour changer l'e-mail)"
                        value={password}
                        type="password"
                        placeholder="••••••••"
                        onChange={setPassword}
                        labelClassName={lc}
                        wrapperClassName={iw}
                        inputClassName={ii}
                    />
                )}

                {error && <p className="text-[13px] text-[#ef5350] px-3 py-2 bg-[#ef5350]/[0.08] border border-[#ef5350]/20 rounded-[8px]">{error}</p>}
                {success && <p className="text-[13px] text-[#4CAF50] px-3 py-2 bg-[#4CAF50]/[0.08] border border-[#4CAF50]/20 rounded-[8px]">Modifications enregistrées.</p>}

                <SubmitButton
                    id="change-info-button"
                    type="submit"
                    text="Enregistrer les modifications"
                    loading={submitLoading}
                    loadingText="Enregistrement…"
                    className="w-full py-3 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-[14px] font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                />
            </form>
        </div>
    );
}
