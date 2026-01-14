'use client';

import Loading from "@/components/loading";
import {useEffect, useState} from "react";
import { authGoogle } from "@/src/api/authGoogle";
import {useRouter} from "next/navigation";

export default function Dashboard() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const router = useRouter();

    useEffect(() => {
        async function verify() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (!code) {
                console.error("Code d'autorisation manquant dans l'URL");
                setError(true);
                return;
            }

            const rep = await authGoogle(code)
            if (!rep.ok) {
                setError(true);
            } else {
                const data = await rep.json();

                if(data.accessToken) {
                    localStorage.setItem("accessToken", data.accessToken);
                    router.push("/dashboard");
                }
            }

            setLoading(false);
        }

        verify();
    });

    return <Loading /> ;
}
