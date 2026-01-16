'use client';

import { useState } from "react";
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

export function useJwtInformation() {
    const [userInfo] = useState<UserInfo>(() => {
        const defaultUser: UserInfo = { id:"", username: "No Name", email: "" };
        if (typeof window === "undefined") return defaultUser;
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decoded = jwtDecode<CustomJwtPayload>(token);
                return {
                    id: decoded.id,
                    username: decoded.username,
                    email: decoded.email
                };
            } catch {
                localStorage.removeItem("accessToken");
            }
        }
        return defaultUser;
    });
    return userInfo;
}

export function getJwtToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
}