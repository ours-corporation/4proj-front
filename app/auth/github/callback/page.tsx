'use client';

import Loading from "@/src/components/Loading";
import {useEffect} from "react";
import { authGoogle } from "@/src/api/authGoogle";
import {useRouter} from "next/navigation";
import {authGithub} from "@/src/api/authGithub";

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        async function verify() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (!code) {
                router.push("/login");
                return;
            }

            const rep = await authGithub(code)
            if (!rep.ok) {
                router.push("/login");
            } else {
                const data = await rep.json();

                if(data.accessToken) {
                    localStorage.setItem("accessToken", data.accessToken);
                    router.push("/dashboard");
                }
            }
        }

        verify();
    });

    return <Loading /> ;
}
