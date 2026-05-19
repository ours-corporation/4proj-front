'use client';

import React, { useState } from "react";
import { register } from "@/src/api/auth";
import { useRouter } from "next/navigation";
import { useNotAuth } from "@/src/hooks/useAuth";
import { registerValidatorValidator } from "@/src/validator/auth";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";

const inputWrapper = "mt-1 w-full bg-[#0d0d0d] border border-white/[0.08] rounded-[10px] px-4 py-3 flex items-center transition-all focus-within:border-[#7c6ef8]/50 focus-within:ring-2 focus-within:ring-[#7c6ef8]/10";
const inputInner = "flex-grow bg-transparent focus:outline-none p-0 border-none ring-0 text-[#ededed] text-sm placeholder:text-[#333]";
const labelClass = "block text-[11px] font-medium text-[#666] mb-1.5 uppercase tracking-wider";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(useNotAuth());
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const validatorResult = registerValidatorValidator.safeParse({ username, email, password, confirmPassword });
        if (!validatorResult.success) {
            setError(validatorResult.error.issues[0].message);
            setLoading(false);
            return;
        }

        try {
            if (password !== confirmPassword) {
                setError("Les mots de passe ne correspondent pas.");
                setLoading(false);
                return;
            }

            const res = await register(email, password, username);

            if (!res.ok) {
                if (res.status === 409) {
                    setError("Un compte existe déjà avec cet email.");
                } else if (res.status === 401) {
                    setError("Les identifiants sont invalides.");
                } else if (res.status >= 500) {
                    setError("Une erreur serveur s'est produite. Cet email est peut-être déjà utilisé.");
                } else {
                    setError(`Erreur : ${res.status}`);
                }
            } else {
                router.push("/login");
            }
        } catch (err) {
            console.error("Register failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet" />
            <style>{`
                @keyframes glowPulse {
                    0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
                    50%       { opacity: 1;   transform: translateX(-50%) scale(1.08); }
                }
                .glow-anim { animation: glowPulse 7s ease-in-out infinite; }
            `}</style>

            <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center relative overflow-hidden p-6 font-['DM_Sans',sans-serif]">

                <div
                    className="glow-anim absolute -top-52 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at center, rgba(124,110,248,0.13) 0%, rgba(66,175,240,0.06) 45%, transparent 70%)" }}
                />

                <div className="w-full max-w-[420px] bg-[#111113] border border-[#7c6ef8]/20 rounded-[20px] px-9 py-10 relative z-10 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">

                    <a href="/" className="flex items-center justify-center gap-2.5 mb-7 no-underline">
                        <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="lg-register" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#7c6ef8" />
                                    <stop offset="100%" stopColor="#42aff0" />
                                </linearGradient>
                            </defs>
                            <rect fill="#0d0d0d" stroke="#7c6ef8" strokeWidth="3" x="2" y="2" width="96" height="96" rx="22" ry="22" />
                            <path fill="url(#lg-register)" d="M72 82H28C16 82 6 73 6 62C6 52 13 43.5 23 41.5C23 30 32 21 44 21C53 21 60.5 26 64 33C66 32.5 68 32 70 32C80 32 88 40 88 50C88 67 81 78 72 82Z" />
                            <polygon fill="#0d0d0d" points="50,30 38,48 45,48 45,62 55,62 55,48 62,48" />
                        </svg>
                        <span className="font-['Syne',sans-serif] text-xl font-bold bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">
                            Supfile
                        </span>
                    </a>

                    <h1 className="font-['Syne',sans-serif] text-[26px] font-extrabold text-[#ededed] text-center mb-1.5 tracking-tight">
                        Inscription
                    </h1>
                    <p className="text-sm text-[#484858] text-center mb-8 font-light">
                        Créez votre compte et démarrez gratuitement.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <InputField
                                id="username"
                                label="Nom d'utilisateur"
                                value={username}
                                type="text"
                                placeholder="votre_pseudo"
                                onChange={setUsername}
                                labelClassName={labelClass}
                                wrapperClassName={inputWrapper}
                                inputClassName={inputInner}
                            />
                        </div>

                        <div className="mb-4">
                            <InputField
                                id="email"
                                label="Email"
                                value={email}
                                type="email"
                                placeholder="vous@exemple.com"
                                onChange={setEmail}
                                required
                                labelClassName={labelClass}
                                wrapperClassName={inputWrapper}
                                inputClassName={inputInner}
                            />
                        </div>

                        <div className="mb-4">
                            <InputField
                                id="password"
                                label="Mot de passe"
                                value={password}
                                type="password"
                                placeholder="••••••••••••"
                                onChange={setPassword}
                                required
                                labelClassName={labelClass}
                                wrapperClassName={inputWrapper}
                                inputClassName={inputInner}
                            />
                        </div>

                        <div className="mb-4">
                            <InputField
                                id="confirm-password"
                                label="Confirmer le mot de passe"
                                value={confirmPassword}
                                type="password"
                                placeholder="••••••••••••"
                                onChange={setConfirmPassword}
                                required
                                labelClassName={labelClass}
                                wrapperClassName={inputWrapper}
                                inputClassName={inputInner}
                            />
                        </div>

                        {error && (
                            <div className="text-[13px] text-[#ef5350] mb-3.5 px-3.5 py-2.5 bg-[#ef5350]/[0.08] border border-[#ef5350]/20 rounded-lg">
                                {error}
                            </div>
                        )}

                        <p className="text-[12px] text-[#333] mb-4">* Champs obligatoires</p>

                        <SubmitButton
                            id="register-button"
                            type="submit"
                            text="Créer mon compte"
                            loading={loading}
                            loadingText="Inscription…"
                            className="w-full py-3.5 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-[15px] font-medium mb-6 shadow-[0_0_30px_rgba(124,110,248,0.25)] hover:opacity-90 hover:-translate-y-px hover:shadow-[0_0_50px_rgba(124,110,248,0.45)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        />
                    </form>

                    <p className="text-center text-[13px] text-[#484858] font-light">
                        Vous avez déjà un compte ?{" "}
                        <a href="/login" className="text-[#7c6ef8] hover:text-[#42aff0] transition-colors no-underline">
                            Se connecter
                        </a>
                    </p>
                </div>

                <p className="absolute bottom-5 text-[12px] text-[#262630] z-10">
                    © 2026 Supfile. Tous droits réservés.
                </p>
            </div>
        </>
    );
}
