'use client';

import Loading from "@/src/components/Loading";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { storeAccessToken } from "@/src/hooks/getJwtInformation";

export default function GithubCallback() {
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const error = urlParams.get('error');

        if (error) {
            router.push("/login?error=" + encodeURIComponent(error));
            return;
        }

        if (!accessToken) {
            router.push("/login?error=" + encodeURIComponent("Échec de la connexion avec GitHub."));
            return;
        }

        const termsRequired = urlParams.get('terms_required') === 'true';
        storeAccessToken(accessToken);
        if (termsRequired) {
            router.push("/accept-terms");
        } else {
            router.push("/dashboard");
        }
    }, []);

    return <Loading />;
}
