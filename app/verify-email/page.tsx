'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/src/api/auth";

type Status = "loading" | "success" | "already" | "error";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setStatus("error");
            setMessage("Lien de vérification invalide ou incomplet.");
            return;
        }

        verifyEmail(token)
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (res.ok && data.success) {
                    setStatus("success");
                } else if (res.ok && data.already) {
                    setStatus("already");
                } else {
                    setStatus("error");
                    setMessage(data.error || "Une erreur est survenue.");
                }
            })
            .catch(() => {
                setStatus("error");
                setMessage("Impossible de joindre le serveur.");
            });
    }, [searchParams]);

    const config = {
        loading: {
            icon: (
                <svg className="animate-spin w-12 h-12 text-[#7c6ef8]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
            ),
            title: "Vérification en cours…",
            subtitle: "Merci de patienter quelques instants.",
            cta: null,
        },
        success: {
            icon: (
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            ),
            title: "Email vérifié !",
            subtitle: "Votre compte est maintenant actif. Vous pouvez vous connecter.",
            cta: { label: "Se connecter", href: "/login" },
        },
        already: {
            icon: (
                <div className="w-12 h-12 rounded-full bg-[#7c6ef8]/15 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#7c6ef8]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            ),
            title: "Déjà vérifié",
            subtitle: "Votre email a déjà été confirmé. Connectez-vous directement.",
            cta: { label: "Se connecter", href: "/login" },
        },
        error: {
            icon: (
                <div className="w-12 h-12 rounded-full bg-[#ef5350]/15 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#ef5350]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            ),
            title: "Lien invalide ou expiré",
            subtitle: message || "Ce lien de vérification n'est plus valide (durée de vie : 24h).",
            cta: { label: "Retour à l'accueil", href: "/" },
        },
    };

    const { icon, title, subtitle, cta } = config[status];

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

                <div className="w-full max-w-[420px] bg-surface dark:bg-[#111113] border border-border-subtle dark:border-[#7c6ef8]/20 rounded-[20px] px-9 py-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)] text-center">

                    <a href="/" className="flex items-center justify-center gap-2.5 mb-7 no-underline">
                        <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="lg-verify" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#7c6ef8" />
                                    <stop offset="100%" stopColor="#42aff0" />
                                </linearGradient>
                            </defs>
                            <rect className="fill-surface dark:fill-[#0d0d0d]" stroke="#7c6ef8" strokeWidth="3" x="2" y="2" width="96" height="96" rx="22" ry="22" />
                            <path fill="url(#lg-verify)" d="M72 82H28C16 82 6 73 6 62C6 52 13 43.5 23 41.5C23 30 32 21 44 21C53 21 60.5 26 64 33C66 32.5 68 32 70 32C80 32 88 40 88 50C88 67 81 78 72 82Z" />
                            <polygon className="fill-surface dark:fill-[#0d0d0d]" points="50,30 38,48 45,48 45,62 55,62 55,48 62,48" />
                        </svg>
                        <span className="font-['Syne',sans-serif] text-xl font-bold bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">
                            Supfile
                        </span>
                    </a>

                    <div className="flex justify-center mb-5">
                        {icon}
                    </div>

                    <h1 className="font-['Syne',sans-serif] text-[22px] font-extrabold text-txt-primary dark:text-[#ededed] mb-2 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-sm text-txt-secondary dark:text-[#484858] font-light mb-7">
                        {subtitle}
                    </p>

                    {cta && (
                        <a
                            href={cta.href}
                            className="inline-block w-full py-3.5 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-[15px] font-medium shadow-[0_0_30px_rgba(124,110,248,0.25)] hover:opacity-90 hover:-translate-y-px hover:shadow-[0_0_50px_rgba(124,110,248,0.45)] transition-all no-underline"
                        >
                            {cta.label}
                        </a>
                    )}
                </div>

                <p className="absolute bottom-5 text-[12px] text-txt-secondary dark:text-[#262630] z-10">
                    © 2026 Supfile. Tous droits réservés.
                </p>
            </div>
        </>
    );
}
