'use client';

import Loading from "@/src/components/Loading";
import { useEffect } from "react";
import { authGithub } from "@/src/api/authGithub";
import { useRouter } from "next/navigation";

export default function GithubCallback() {
    const router = useRouter();

    useEffect(() => {
        async function verify() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (!code) {
                router.push("/login?error=" + encodeURIComponent("Code d'autorisation GitHub manquant."));
                return;
            }

            try {
                const redirectUri = window.location.origin + "/auth/github/callback";
            const rep = await authGithub(code, redirectUri);
                if (!rep.ok) {
                    let errorMsg = "Échec de la connexion avec GitHub.";
                    try {
                        const data = await rep.json();
                        if (data?.error) errorMsg = data.error;
                    } catch {}
                    router.push("/login?error=" + encodeURIComponent(errorMsg));
                } else {
                    const data = await rep.json();
                    if (data.accessToken) {
                        localStorage.setItem("accessToken", data.accessToken);
                        router.push("/dashboard");
                    } else {
                        router.push("/login?error=" + encodeURIComponent("Échec de la connexion avec GitHub."));
                    }
                }
            } catch {
                router.push("/login?error=" + encodeURIComponent("Impossible de joindre le serveur. Vérifiez votre connexion."));
            }
        }

        verify();
    }, []);

    return <Loading />;
}
