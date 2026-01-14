'use client';

import React, {useEffect} from "react";
import { useState } from "react";
import InputField from "@/components/auth/input/InputField";
import SubmitButton from "@/components/auth/button/SubmitButton";
import { login } from "@/src/api/auth";
import {useRouter} from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { GetGoogleClientId } from "@/src/services/envReader"


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    const [ redirect, setRedirect ] = useState("");
    const [ redirectUri, setRedirectUri ] = useState("");

    const uriGoogle = GetGoogleClientId();

    useEffect(() => {
        setRedirect(window.location.origin + "/auth/google/callback");
        setRedirectUri("https://accounts.google.com/o/oauth2/v2/auth?client_id=" + uriGoogle +"&redirect_uri=" + redirect + "&response_type=code&scope=openid email profile&access_type=offline&prompt=consent");
        console.log(redirect);
        console.log(redirectUri);
    }, [uriGoogle, redirect, redirectUri]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await login(email, password);

            if (!res.ok) {
                if(res.status === 401) {
                    setError("Les identifiants sont invalides.");
                    return;
                } else {
                    setError(`Erreur : ${res.status}`);
                    return;
                }
            }

            const data = await res.json();

            if(data.accessToken) {
                router.push("/dashboard");
            }

        } catch {
            console.error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    console.log(uriGoogle);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
            >
                <h1 className="text-2xl font-semibold text-center text-gray-800">
                    Connexion
                </h1>

                <InputField
                    id="email"
                    name="email"
                    label="Email"
                    value={email}
                    type="email"

                    onChange={setEmail}
                />

                <InputField
                    id="password"
                    name="password"
                    label="Mot de passe"
                    value={password}
                    type="password"
                    onChange={setPassword}
                />

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <SubmitButton
                    id="login-button"
                    type="submit"
                    text="Se connecter"
                    loading={loading}
                    loadingText="Connexion..."
                />

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="text-xs text-gray-500">OU</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = redirectUri
                        }}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
                    >
                        <FcGoogle size={22} />
                        <span className="text-sm font-medium text-gray-700">
                            Continuer avec Google
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = "http://localhost:3000/auth/google";
                        }}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
                    >
                        <FaGithub size={22} />
                        <span className="text-sm font-medium text-gray-700">
                            Continuer avec Github
                        </span>
                    </button>
                </div>

                <p className="text-sm text-center text-gray-600">
                    Pas de compte ?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Inscrivez-vous
                    </a>
                </p>
            </form>

            <div className="absolute bottom-4 text-center w-full text-gray-500 text-sm">
                &copy; 2026 Supfile. Tous droits réservés.
            </div>
        </main>
    );
}
