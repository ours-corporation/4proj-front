'use client';

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/src/api/auth";

const inputWrapper = "mt-1 w-full bg-input-bg dark:bg-[#0d0d0d] border border-border-subtle dark:border-white/[0.08] rounded-[10px] px-4 py-3 flex items-center transition-all focus-within:border-[#7c6ef8]/50 focus-within:ring-2 focus-within:ring-[#7c6ef8]/10";
const inputInner = "flex-grow bg-transparent focus:outline-none p-0 border-none ring-0 text-txt-primary dark:text-[#ededed] text-sm placeholder:text-[#9CA3AF] dark:placeholder:text-[#333]";
const labelClass = "block text-[11px] font-medium text-txt-secondary dark:text-[#666] mb-1.5 uppercase tracking-wider";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const validate = (): string => {
        if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
        if (password !== confirm) return "Les mots de passe ne correspondent pas.";
        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        if (!token) { setError("Lien invalide ou expiré."); return; }

        setLoading(true);
        setError("");
        try {
            const res = await resetPassword(token, password);
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success) {
                setSuccess(true);
            } else {
                setError(data.error || "Une erreur est survenue.");
            }
        } catch {
            setError("Impossible de joindre le serveur. Vérifiez votre connexion.");
        } finally {
            setLoading(false);
        }
    };

    const Logo = () => (
        <a href="/" className="flex items-center justify-center gap-2.5 mb-7 no-underline">
            <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="lg-rp" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7c6ef8" />
                        <stop offset="100%" stopColor="#42aff0" />
                    </linearGradient>
                </defs>
                <rect className="fill-surface dark:fill-[#0d0d0d]" stroke="#7c6ef8" strokeWidth="3" x="2" y="2" width="96" height="96" rx="22" ry="22" />
                <path fill="url(#lg-rp)" d="M72 82H28C16 82 6 73 6 62C6 52 13 43.5 23 41.5C23 30 32 21 44 21C53 21 60.5 26 64 33C66 32.5 68 32 70 32C80 32 88 40 88 50C88 67 81 78 72 82Z" />
                <polygon className="fill-surface dark:fill-[#0d0d0d]" points="50,30 38,48 45,48 45,62 55,62 55,48 62,48" />
            </svg>
            <span className="font-['Syne',sans-serif] text-xl font-bold bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">
                Supfile
            </span>
        </a>
    );

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

            <div className="min-h-screen bg-main-bg dark:bg-[#0d0d0d] flex flex-col items-center justify-center relative overflow-hidden p-6 font-['DM_Sans',sans-serif]">
                <div
                    className="glow-anim absolute -top-52 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at center, rgba(124,110,248,0.13) 0%, rgba(66,175,240,0.06) 45%, transparent 70%)" }}
                />

                <div className="w-full max-w-[420px] bg-surface dark:bg-[#111113] border border-border-subtle dark:border-[#7c6ef8]/20 rounded-[20px] px-9 py-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                    <Logo />

                    {!token ? (
                        <div className="text-center">
                            <p className="text-[#ef5350] text-sm mb-4">Lien de réinitialisation manquant ou invalide.</p>
                            <a href="/forgot-password" className="text-[#7c6ef8] text-sm no-underline hover:text-[#42aff0]">
                                Demander un nouveau lien
                            </a>
                        </div>
                    ) : success ? (
                        <div className="text-center">
                            <div className="flex justify-center mb-5">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="font-['Syne',sans-serif] text-[22px] font-extrabold text-txt-primary dark:text-[#ededed] mb-2 tracking-tight">
                                Mot de passe modifié !
                            </h2>
                            <p className="text-sm text-txt-secondary dark:text-[#484858] font-light mb-7">
                                Votre mot de passe a été réinitialisé avec succès.
                            </p>
                            <a
                                href="/login"
                                className="inline-block w-full py-3.5 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-[15px] font-medium text-center shadow-[0_0_30px_rgba(124,110,248,0.25)] hover:opacity-90 transition-all no-underline"
                            >
                                Se connecter
                            </a>
                        </div>
                    ) : (
                        <>
                            <h1 className="font-['Syne',sans-serif] text-[26px] font-extrabold text-txt-primary dark:text-[#ededed] text-center mb-1.5 tracking-tight">
                                Nouveau mot de passe
                            </h1>
                            <p className="text-sm text-txt-secondary dark:text-[#484858] text-center mb-8 font-light">
                                Choisissez un nouveau mot de passe sécurisé.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="password" className={labelClass}>Nouveau mot de passe</label>
                                    <div className={inputWrapper}>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="••••••••••••"
                                            className={inputInner}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(v => !v)}
                                            className="ml-2 text-[#9CA3AF] hover:text-txt-primary dark:hover:text-[#ededed] transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                {showPassword
                                                    ? <><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></>
                                                    : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                                                }
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label htmlFor="confirm" className={labelClass}>Confirmer le mot de passe</label>
                                    <div className={inputWrapper}>
                                        <input
                                            id="confirm"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={confirm}
                                            onChange={e => setConfirm(e.target.value)}
                                            placeholder="••••••••••••"
                                            className={inputInner}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-[13px] text-[#ef5350] mb-3.5 px-3.5 py-2.5 bg-[#ef5350]/[0.08] border border-[#ef5350]/20 rounded-lg">
                                        {error}
                                        {(error.includes("expiré") || error.includes("invalide")) && (
                                            <a href="/forgot-password" className="block mt-1.5 text-[#7c6ef8] hover:underline no-underline">
                                                Demander un nouveau lien →
                                            </a>
                                        )}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-[15px] font-medium shadow-[0_0_30px_rgba(124,110,248,0.25)] hover:opacity-90 hover:-translate-y-px hover:shadow-[0_0_50px_rgba(124,110,248,0.45)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {loading ? "Réinitialisation…" : "Réinitialiser le mot de passe"}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <p className="absolute bottom-5 text-[12px] text-txt-secondary dark:text-[#262630] z-10">
                    © 2026 Supfile. Tous droits réservés.
                </p>
            </div>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordContent />
        </Suspense>
    );
}
