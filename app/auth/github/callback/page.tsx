'use client';

import Loading from "@/src/components/Loading";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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

        localStorage.setItem("accessToken", accessToken);
        router.push("/dashboard");
    }, []);

    return <Loading />;
}
