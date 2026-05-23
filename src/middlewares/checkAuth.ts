'use client';

import { refreshToken } from "@/src/api/auth";

function isTokenValid(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now() + 10_000;
    } catch {
        return false;
    }
}

export async function checkAuth(): Promise<boolean> {
    const accessToken = localStorage.getItem('accessToken');

    // Vérification locale sans requête réseau
    if (accessToken && isTokenValid(accessToken)) {
        return true;
    }

    // Token absent ou expiré — on tente un refresh via le cookie HttpOnly
    localStorage.removeItem('accessToken');
    try {
        const response = await refreshToken();
        if (!response.ok) return false;
        const data = await response.json();
        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            return true;
        }
    } catch { /* réseau indisponible */ }

    return false;
}
