'use client';

import React, { useState } from "react";
import { forgotPassword } from "@/src/api/auth";

const inputWrapper = "mt-1 w-full bg-input-bg dark:bg-[#0d0d0d] border border-border-subtle dark:border-white/[0.08] rounded-[10px] px-4 py-3 flex items-center transition-all focus-within:border-[#7c6ef8]/50 focus-within:ring-2 focus-within:ring-[#7c6ef8]/10";
const inputInner = "flex-grow bg-transparent focus:outline-none p-0 border-none ring-0 text-txt-primary dark:text-[#ededed] text-sm placeholder:text-[#9CA3AF] dark:placeholder:text-[#333]";
const labelClass = "block text-[11px] font-medium text-txt-secondary dark:text-[#666] mb-1.5 uppercase tracking-wider";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [oauthProvider, setOauthProvider] = useState<"google" | "github" | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await forgotPassword(email.trim());
            const data = await res.json().catch(() => ({}));
            if (data.oauthOnly) {
                setOauthProvider(data.provider);
            } else {
                setSent(true);
            }
        } catch {
            setError("Impossible de joindre le serveur. Vérifiez votre connexion.");
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

            <div className="min-h-screen bg-main-bg dark:bg-[#0d0d0d] flex flex-col items-center justify-center relative overflow-hidden p-6 font-['DM_Sans',sans-serif]">
                <div
                    className="glow-anim absolute -top-52 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at center, rgba(124,110,248,0.13) 0%, rgba(66,175,240,0.06) 45%, transparent 70%)" }}
                />

                <div className="w-full max-w-[420px] bg-surface dark:bg-[#111113] border border-border-subtle dark:border-[#7c6ef8]/20 rounded-[20px] px-9 py-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">

                    <a href="/" className="flex items-center justify-center gap-2.5 mb-7 no-underline">
                        <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="lg-fp" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#7c6ef8" />
                                    <stop offset="100%" stopColor="#42aff0" />
                                </linearGradient>
                            </defs>
                            <rect className="fill-surface dark:fill-[#0d0d0d]" stroke="#7c6ef8" strokeWidth="3" x="2" y="2" width="96" height="96" rx="22" ry="22" />
                            <path fill="url(#lg-fp)" d="M72 82H28C16 82 6 73 6 62C6 52 13 43.5 23 41.5C23 30 32 21 44 21C53 21 60.5 26 64 33C66 32.5 68 32 70 32C80 32 88 40 88 50C88 67 81 78 72 82Z" />
                            <polygon className="fill-surface dark:fill-[#0d0d0d]" points="50,30 38,48 45,48 45,62 55,62 55,48 62,48" />
                        </svg>
                        <span className="font-['Syne',sans-serif] text-xl font-bold bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">
                            Supfile
                        </span>
                    </a>

                    {oauthProvider ? (
                        <div className="text-center">
                            <div className="flex justify-center mb-5">
                                <div className="w-12 h-12 rounded-full bg-[#7c6ef8]/15 flex items-center justify-center">
                                    {oauthProvider === 'google' ? (
                                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-txt-primary dark:text-[#ededed]" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <h2 className="font-['Syne',sans-serif] text-[22px] font-extrabold text-txt-primary dark:text-[#ededed] mb-3 tracking-tight">
                                Connexion via {oauthProvider === 'google' ? 'Google' : 'GitHub'}
                            </h2>
                            <p className="text-sm text-txt-secondary dark:text-[#484858] font-light mb-7">
                                Ce compte utilise la connexion {oauthProvider === 'google' ? 'Google' : 'GitHub'}.
                                Vous n'avez pas de mot de passe — connectez-vous directement avec votre fournisseur habituel.
                            </p>
                            <a
                                href="/login"
                                className="inline-block w-full py-3.5 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-[15px] font-medium text-center shadow-[0_0_30px_rgba(124,110,248,0.25)] hover:opacity-90 transition-all no-underline"
                            >
                                Retour à la connexion
                            </a>
                        </div>
                    ) : sent ? (
                        <div className="text-center">
                            <div className="flex justify-center mb-5">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="font-['Syne',sans-serif] text-[22px] font-extrabold text-txt-primary dark:text-[#ededed] mb-2 tracking-tight">
                                Email envoyé !
                            </h2>
                            <p className="text-sm text-txt-secondary dark:text-[#484858] font-light mb-2">
                                Si un compte existe avec l'adresse
                            </p>
                            <p className="text-sm font-medium text-[#7c6ef8] mb-4 break-all">{email}</p>
                            <p className="text-[12px] text-txt-secondary dark:text-[#333] mb-7">
                                vous recevrez un lien valable <strong>1 heure</strong> pour réinitialiser votre mot de passe.
                            </p>
                            <a
                                href="/login"
                                className="inline-block w-full py-3 rounded-[10px] border border-border-subtle dark:border-white/[0.07] text-txt-secondary dark:text-[#bbb] text-sm text-center hover:border-[#7c6ef8]/30 hover:text-[#7c6ef8] transition-all no-underline"
                            >
                                Retour à la connexion
                            </a>
                        </div>
                    ) : (
                        <>
                            <h1 className="font-['Syne',sans-serif] text-[26px] font-extrabold text-txt-primary dark:text-[#ededed] text-center mb-1.5 tracking-tight">
                                Mot de passe oublié
                            </h1>
                            <p className="text-sm text-txt-secondary dark:text-[#484858] text-center mb-8 font-light">
                                Entrez votre email pour recevoir un lien de réinitialisation.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-5">
                                    <label htmlFor="email" className={labelClass}>Email</label>
                                    <div className={inputWrapper}>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="vous@exemple.com"
                                            className={inputInner}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-[13px] text-[#ef5350] mb-3.5 px-3.5 py-2.5 bg-[#ef5350]/[0.08] border border-[#ef5350]/20 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-[15px] font-medium mb-4 shadow-[0_0_30px_rgba(124,110,248,0.25)] hover:opacity-90 hover:-translate-y-px hover:shadow-[0_0_50px_rgba(124,110,248,0.45)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {loading ? "Envoi…" : "Envoyer le lien"}
                                </button>
                            </form>

                            <p className="text-center text-[13px] text-txt-secondary dark:text-[#484858] font-light">
                                <a href="/login" className="text-[#7c6ef8] hover:text-[#42aff0] transition-colors no-underline">
                                    ← Retour à la connexion
                                </a>
                            </p>
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
