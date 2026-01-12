'use client';

import { testToken, refreshToken } from "@/api/auth";

async function checkAuth(): Promise<boolean> {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && accessToken !== "undefined") {
        if (await testToken(accessToken)) {
            return true;
        }
    }

    try {
        const response = await refreshToken();
        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            return true;
        }
    } catch {
        return false;
    }

    return false;
}

export default checkAuth;
