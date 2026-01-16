'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/src/middlewares/checkAuth"; // ton checkAuth côté client

export function useAuth() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function verify() {
            const isAuth = await checkAuth();
            if (!isAuth) {
                router.replace('/login');
            } else {
                setLoading(false);
            }
        }
        verify();
    }, [router]);

    return loading;
}

export function useNotAuth() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function verify() {
            const isAuth = await checkAuth();
            if (isAuth) {
                router.replace('/dashboard');
            } else {
                setLoading(true);
            }
        }
        verify();
    }, [router]);

    return loading;
}