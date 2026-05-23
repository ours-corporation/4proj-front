'use client';

import { storeAccessToken } from "@/src/hooks/getJwtInformation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function attemptRefresh(): Promise<string | null> {
    try {
        const res = await fetch(`${API_URL}/api/refresh`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data.accessToken) {
            storeAccessToken(data.accessToken);
            return data.accessToken;
        }
        return null;
    } catch {
        return null;
    }
}

function buildHeaders(token: string | null, extra?: HeadersInit): Headers {
    const headers = new Headers(extra);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
}

/**
 * Wrapper fetch authentifié.
 * - Injecte automatiquement le Bearer token.
 * - Sur 401 : tente un refresh via le cookie HttpOnly, puis relance la requête.
 * - Si le refresh échoue : nettoie le localStorage et redirige vers /login.
 */
export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('accessToken');
    const { headers: extra, ...rest } = init;

    let res = await fetch(`${API_URL}${path}`, {
        ...rest,
        headers: buildHeaders(token, extra),
    });

    if (res.status !== 401) return res;

    const newToken = await attemptRefresh();
    if (newToken) {
        return fetch(`${API_URL}${path}`, {
            ...rest,
            headers: buildHeaders(newToken, extra),
        });
    }

    localStorage.removeItem('accessToken');
    if (typeof window !== 'undefined') window.location.href = '/login';
    return res;
}

/**
 * Pour les requêtes XHR (uploads avec progression) : retourne un token valide,
 * en faisant un refresh si le token actuel est expiré.
 */
export async function getValidToken(): Promise<string | null> {
    const token = localStorage.getItem('accessToken');
    if (!token) return await attemptRefresh();

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (typeof payload.exp === 'number' && payload.exp * 1000 > Date.now() + 10_000) {
            return token;
        }
    } catch { /* JWT malformé */ }

    return await attemptRefresh();
}
