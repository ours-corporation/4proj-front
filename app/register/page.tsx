'use client';

import React from "react";
import { useState } from "react";
import InputField from "@/components/auth/input/InputField";
import SubmitButton from "@/components/auth/button/SubmitButton";
import { register } from "@/api/auth";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (password !== confirmPassword) {
                setError("Les mots de passe ne correspondent pas.");
                setLoading(false);
                return;
            }

            const res = await register(email, password);

            if (!res.ok) {
                if(res.status === 401) {
                    setError("Les identifiants sont invalides.");
                } else {
                    setError(`Erreur : ${res.status}`);
                }
            }

            const data = await res.json();
            console.log("Login OK", data);
            // localStorage.setItem("token", data.token)
        } catch (err) {
            console.error("Login failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
            >
                <h1 className="text-2xl font-semibold text-center text-gray-800">
                    Inscription
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

                <InputField
                    id="confirm-password"
                    name="confirm-password"
                    label="Confirmer le mot de passe"
                    value={confirmPassword}
                    type="password"
                    onChange={setConfirmPassword}
                />

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <SubmitButton
                    id="login-button"
                    type="submit"
                    text="S'inscrire"
                    loading={loading}
                    loadingText="Inscription..."
                />

                <p className="text-sm text-center text-gray-600">
                    Vous avez déjà un compte ?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Connectez-vous
                    </a>
                </p>
            </form>
            <div className="absolute bottom-4 text-center w-full text-gray-500 text-sm">
                &copy; 2026 Supfile. Tous droits réservés.
            </div>
        </main>
    );
}
