'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { acceptTerms } from "@/src/api/auth";
import { storeAccessToken, getJwtToken } from "@/src/hooks/getJwtInformation";

export default function AcceptTermsPage() {
    const router = useRouter();
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = getJwtToken();
        if (!token) {
            router.push("/login");
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accepted) return;

        const token = getJwtToken();
        if (!token) {
            router.push("/login");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await acceptTerms(token);
            if (!res.ok) {
                setError("Une erreur s'est produite. Veuillez réessayer.");
                return;
            }
            const data = await res.json();
            if (data.accessToken) {
                storeAccessToken(data.accessToken);
                router.push("/dashboard");
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

                <div className="w-full max-w-[440px] bg-surface dark:bg-[#111113] border border-border-subtle dark:border-[#7c6ef8]/20 rounded-[20px] px-9 py-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">

                    <div className="flex items-center justify-center gap-2.5 mb-7">
                        <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="lg-terms" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#7c6ef8" />
                                    <stop offset="100%" stopColor="#42aff0" />
                                </linearGradient>
                            </defs>
                            <rect className="fill-surface dark:fill-[#0d0d0d]" stroke="#7c6ef8" strokeWidth="3" x="2" y="2" width="96" height="96" rx="22" ry="22" />
                            <path fill="url(#lg-terms)" d="M72 82H28C16 82 6 73 6 62C6 52 13 43.5 23 41.5C23 30 32 21 44 21C53 21 60.5 26 64 33C66 32.5 68 32 70 32C80 32 88 40 88 50C88 67 81 78 72 82Z" />
                            <polygon className="fill-surface dark:fill-[#0d0d0d]" points="50,30 38,48 45,48 45,62 55,62 55,48 62,48" />
                        </svg>
                        <span className="font-['Syne',sans-serif] text-xl font-bold bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">
                            Supfile
                        </span>
                    </div>

                    <h1 className="font-['Syne',sans-serif] text-[24px] font-extrabold text-txt-primary dark:text-[#ededed] text-center mb-1.5 tracking-tight">
                        Conditions d'utilisation
                    </h1>
                    <p className="text-sm text-txt-secondary dark:text-[#484858] text-center mb-8 font-light">
                        Veuillez accepter nos conditions pour continuer.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label className="flex items-start gap-3 cursor-pointer mb-6 group">
                            <div className="relative mt-0.5 flex-shrink-0">
                                <input
                                    type="checkbox"
                                    checked={accepted}
                                    onChange={(e) => setAccepted(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all ${
                                    accepted
                                        ? "bg-gradient-to-br from-[#7c6ef8] to-[#42aff0] border-transparent"
                                        : "border-border-subtle dark:border-white/[0.15] bg-transparent group-hover:border-[#7c6ef8]/50"
                                }`}>
                                    {accepted && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className="text-[13px] text-txt-secondary dark:text-[#888] leading-relaxed">
                                J'accepte les{" "}
                                <a href="/cgu" target="_blank" rel="noopener noreferrer" className="text-[#7c6ef8] hover:text-[#42aff0] transition-colors no-underline">
                                    Conditions Générales d'Utilisation
                                </a>{" "}
                                et les{" "}
                                <a href="/mentions-legales" target="_blank" rel="noopener noreferrer" className="text-[#7c6ef8] hover:text-[#42aff0] transition-colors no-underline">
                                    Mentions légales
                                </a>{" "}
                                de Supfile.
                            </span>
                        </label>

                        {error && (
                            <div className="text-[13px] text-[#ef5350] mb-4 px-3.5 py-2.5 bg-[#ef5350]/[0.08] border border-[#ef5350]/20 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!accepted || loading}
                            className="w-full py-3.5 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-[15px] font-medium shadow-[0_0_30px_rgba(124,110,248,0.25)] hover:opacity-90 hover:-translate-y-px hover:shadow-[0_0_50px_rgba(124,110,248,0.45)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none cursor-pointer"
                        >
                            {loading ? "Enregistrement…" : "Accepter et continuer"}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="w-full mt-3 py-2.5 text-[13px] text-txt-secondary dark:text-[#484858] hover:text-txt-primary dark:hover:text-[#888] transition-colors cursor-pointer"
                        >
                            Refuser et se déconnecter
                        </button>
                    </form>
                </div>

                <p className="absolute bottom-5 text-[12px] text-txt-secondary dark:text-[#262630] z-10">
                    © 2026 Supfile. Tous droits réservés.
                </p>
            </div>
        </>
    );
}
