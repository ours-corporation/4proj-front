'use client';

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
    id: string;
    username: string;
    email: string;
    exp?: number;
    iat?: number;
}

interface UserInfo {
    id: string;
    username: string;
    email: string;
}

function readFromToken(): UserInfo | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("accessToken");
    if (token) {
        try {
            const decoded = jwtDecode<CustomJwtPayload>(token);
            return { id: decoded.id, username: decoded.username, email: decoded.email };
        } catch {
            localStorage.removeItem("accessToken");
        }
    }
    return null;
}

export function useJwtInformation() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        setUserInfo(readFromToken());
        function refresh() {
            const next = readFromToken();
            if (next) setUserInfo(next);
        }
        window.addEventListener("auth:token-updated", refresh);
        return () => window.removeEventListener("auth:token-updated", refresh);
    }, []);

    return userInfo;
}

export function getJwtToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
}

export function storeAccessToken(token: string) {
    localStorage.setItem("accessToken", token);
    window.dispatchEvent(new Event("auth:token-updated"));
}