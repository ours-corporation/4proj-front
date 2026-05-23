'use client';

import Loading from "@/src/components/Loading";
import { useEffect } from "react";
import { authGoogle } from "@/src/api/authGoogle";
import { useRouter } from "next/navigation";
import { storeAccessToken } from "@/src/hooks/getJwtInformation";

export default function GoogleCallback() {
    const router = useRouter();

    useEffect(() => {
        async function verify() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (!code) {
                router.push("/login?error=" + encodeURIComponent("Code d'autorisation Google manquant."));
                return;
            }

            try {
                const redirectUri = window.location.origin + "/auth/google/callback";
            const rep = await authGoogle(code, redirectUri);
                if (!rep.ok) {
                    let errorMsg = "Échec de la connexion avec Google.";
                    try {
                        const data = await rep.json();
                        if (data?.error) errorMsg = data.error;
                    } catch {}
                    router.push("/login?error=" + encodeURIComponent(errorMsg));
                } else {
                    const data = await rep.json();
                    if (data.accessToken) {
                        storeAccessToken(data.accessToken);
                        router.push("/dashboard");
                    } else {
                        router.push("/login?error=" + encodeURIComponent("Échec de la connexion avec Google."));
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
