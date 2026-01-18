'use client';

import React, {useEffect} from "react";
import { useState } from "react";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";
import { login } from "@/src/api/auth";
import {useRouter} from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { loginValidatorValidator } from "@/src/validator/auth";

import { GetGoogleClientId, GetGithubClientId } from "@/src/services/envReader"
import { useNotAuth } from "@/src/hooks/useAuth";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(useNotAuth());
    const [error, setError] = useState("");

    const router = useRouter();

    //information Google OAuth
    const [ googleCallback, setGoogleCallback ] = useState("");
    const [ googleRedirectUri, setGoogleRedirectUri ] = useState("");
    const googleClientId = GetGoogleClientId();

    //information Github OAuth
    const [ githubCallback, setGithubCallback ] = useState("");
    const [ githubRedirectUri, setGithubRedirectUri ] = useState("");
    const githubClientId = GetGithubClientId();


    useEffect(() => {
        setGoogleCallback(window.location.origin + "/auth/google/callback");
        setGoogleRedirectUri("https://accounts.google.com/o/oauth2/v2/auth?client_id=" + googleClientId +"&redirect_uri=" + googleCallback + "&response_type=code&scope=openid email profile&access_type=offline&prompt=consent");

        setGithubCallback(window.location.origin + "/auth/github/callback");
        //todo : revoir le state (pour CSRF)
        setGithubRedirectUri("https://github.com/login/oauth/authorize?client_id=" + githubClientId + "&redirect_uri=" + githubCallback + "&scope=user:email&state=xyz");
    }, [googleClientId, googleCallback, googleRedirectUri, githubClientId, githubCallback, githubRedirectUri]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const validatorResult = loginValidatorValidator.safeParse({ email, password });
        if (!validatorResult.success) {
            const firstError = validatorResult.error.issues[0];
            setError(firstError.message);
            setLoading(false);
            return;
        }

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

    return (
        <main className="min-h-screen flex items-center justify-center bg-main-bg dark:bg-dark-main-bg">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-lg space-y-6"
            >
                <h1 className="text-2xl font-semibold text-center text-txt-primary dark:text-dark-txt-primary">
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
                    <p className="text-sm text-error dark:text-dark-error">{error}</p>
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
                        <div className="flex-1 h-px bg-txt-secondary dark:bg-dark-txt-primary" />
                        <span className="text-xs text-txt-secondary dark:text-dark-txt-primary">OU</span>
                        <div className="flex-1 h-px bg-txt-secondary dark:bg-dark-txt-primary" />
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = googleRedirectUri;
                        }}
                        className="w-full flex items-center justify-center gap-3 border border-border-subtle dark:border-dark-border-subtle rounded-lg py-2 hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition"
                    >
                        <FcGoogle size={22} />
                        <span className="text-sm font-medium text-txt-primary dark:text-dark-txt-primary">
                            Continuer avec Google
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = githubRedirectUri;
                        }}
                        className="w-full flex items-center justify-center gap-3 border border-border-subtle dark:border-dark-border-subtle rounded-lg py-2 hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition"
                    >
                        <FaGithub size={22} />
                        <span className="text-sm font-medium text-txt-primary dark:text-dark-txt-primary">
                            Continuer avec Github
                        </span>
                    </button>
                </div>

                <p className="text-sm text-center text-txt-secondary dark:text-dark-txt-secondary">
                    Pas de compte ?{" "}
                    <a href="/register" className="text-action dark:text-dark-action hover:underline">
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
