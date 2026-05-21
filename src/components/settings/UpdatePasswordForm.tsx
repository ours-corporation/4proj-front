'use client';

import { useState } from "react";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";
import { updatePassword } from "@/src/api/user";

const iw = "mt-1 w-full bg-input-bg dark:bg-[#0d0d0d] border border-border-subtle dark:border-white/[0.08] rounded-[10px] px-4 py-3 flex items-center transition-all focus-within:border-[#7c6ef8]/50 focus-within:ring-1 focus-within:ring-[#7c6ef8]/20";
const ii = "flex-grow bg-transparent focus:outline-none p-0 border-none ring-0 text-txt-primary dark:text-[#ededed] text-sm placeholder:text-[#9CA3AF] dark:placeholder:text-[#333]";
const lc = "block text-[11px] font-medium text-txt-secondary dark:text-[#555] mb-1.5 uppercase tracking-wider";

export default function UpdatePasswordForm() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            if (newPassword !== confirmPassword) { setError("Les mots de passe ne correspondent pas."); setLoading(false); return; }
            await updatePassword(oldPassword, newPassword);
            setSuccess(true);
            setOldPassword(""); setNewPassword(""); setConfirmPassword("");
        } catch (err) {
            console.error("error updating the password:", err);
            setError("Une erreur est survenue. Vérifiez votre mot de passe actuel.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface dark:bg-[#111113] border border-border-subtle dark:border-white/[0.06] rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-none">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[#ef5350]/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ef5350" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-[15px] font-semibold text-txt-primary dark:text-[#ededed]">Sécurité</h2>
                    <p className="text-[12px] text-txt-secondary dark:text-[#444]">Modifier votre mot de passe</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField id="old-password" name="old-password" label="Mot de passe actuel" value={oldPassword} type="password" placeholder="••••••••" onChange={setOldPassword} labelClassName={lc} wrapperClassName={iw} inputClassName={ii} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField id="new-password" name="new-password" label="Nouveau mot de passe" value={newPassword} type="password" placeholder="••••••••" onChange={setNewPassword} labelClassName={lc} wrapperClassName={iw} inputClassName={ii} />
                    <InputField id="confirm-password" name="confirm-password" label="Confirmer" value={confirmPassword} type="password" placeholder="••••••••" onChange={setConfirmPassword} labelClassName={lc} wrapperClassName={iw} inputClassName={ii} />
                </div>

                {error && <p className="text-[13px] text-[#ef5350] px-3 py-2 bg-[#ef5350]/[0.08] border border-[#ef5350]/20 rounded-[8px]">{error}</p>}
                {success && <p className="text-[13px] text-[#4CAF50] px-3 py-2 bg-[#4CAF50]/[0.08] border border-[#4CAF50]/20 rounded-[8px]">Mot de passe mis à jour.</p>}

                <SubmitButton
                    id="change-password-button"
                    type="submit"
                    text="Mettre à jour le mot de passe"
                    loading={loading}
                    loadingText="Enregistrement…"
                    className="w-full py-3 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-[14px] font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                />
            </form>
        </div>
    );
}
