"use client";

import React, { useState } from "react";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";
import { getPublicShareAPI, downloadPublicShareAPI } from "@/src/api/share";
import { PublicShareResponse } from "@/src/interface/share";
import { getFileColor } from "@/src/utils/get-file-color";
import { getFileSvg } from "@/src/utils/get-file-svg";
import { convertFileSize } from "@/src/utils/convert-file-size";
import {downloadFileService} from "@/src/services/downloadFile";

import{downloadPublicFileService} from "@/src/services/downloadPublicFile";

type ApiResult = Awaited<ReturnType<typeof getPublicShareAPI>>;

interface ShowPublicShareProps {
    shareId: string;
    initialResult: ApiResult;
}

export default function ShowPublicShare({ shareId, initialResult }: ShowPublicShareProps) {
    const [password, setPassword] = useState("");
    const [result, setResult] = useState<ApiResult>(initialResult);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function downloadFileById() {
        const share = result.data as PublicShareResponse;
        const file = share.data;
        await downloadPublicFileService(shareId, password)
    }

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        const resp = await getPublicShareAPI(shareId, password);
        setResult(resp);
        if (!resp.success) {
            setError("Mot de passe incorrect. Veuillez réessayer.");
        }
        setLoading(false);
    };

    if (!result.success && result.error === "PASSWORD_REQUIRED") {
        return (
            <div className="min-h-screen bg-main-bg dark:bg-dark-main-bg flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-surface dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border-subtle p-8 flex flex-col items-center gap-6 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-action/10 dark:bg-dark-action/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-action dark:text-dark-action">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </div>

                    <div className="text-center">
                        <h1 className="text-xl font-bold text-txt-primary dark:text-dark-txt-primary">
                            Fichier protégé
                        </h1>
                        <p className="mt-1 text-sm text-txt-secondary dark:text-dark-txt-secondary">
                            Ce fichier est protégé par un mot de passe.
                        </p>
                    </div>

                    <div className="w-full flex flex-col gap-4">
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
                            id="submit-password"
                            type="button"
                            text="Accéder au fichier"
                            loading={loading}
                            loadingText="Vérification..."
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (result.success && result.data) {
        const share = result.data as PublicShareResponse;
        const file = share.data;
        const color = getFileColor(file.mime_type);
        const svgSrc = getFileSvg(file.mime_type);

        return (
            <div className="min-h-screen bg-main-bg dark:bg-dark-main-bg flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-surface dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border-subtle p-8 flex flex-col gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${color}20` }}
                        >
                            <img src={svgSrc} alt={file.mime_type} className="w-8 h-8" />
                        </div>
                        <div className="min-w-0">
                            <h1
                                className="text-lg font-bold text-txt-primary dark:text-dark-txt-primary truncate"
                                title={file.fullName}
                            >
                                {file.fullName}
                            </h1>
                            <p className="text-sm text-txt-secondary dark:text-dark-txt-secondary">
                                Partagé par <span className="font-medium">{share.owner}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-main-bg dark:bg-dark-main-bg text-txt-secondary dark:text-dark-txt-secondary border border-border-subtle dark:border-dark-border-subtle">
                            {convertFileSize(file.size_bytes)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-main-bg dark:bg-dark-main-bg text-txt-secondary dark:text-dark-txt-secondary border border-border-subtle dark:border-dark-border-subtle">
                            {file.mime_type}
                        </span>
                    </div>

                    <button
                        onClick={downloadFileById}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-action dark:bg-dark-action text-white font-medium text-sm hover:opacity-90 transition-opacity"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Télécharger
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-main-bg dark:bg-dark-main-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-surface dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border-subtle p-8 flex flex-col items-center gap-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-error/10 dark:bg-dark-error/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-error dark:text-dark-error">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>
                <p className="text-txt-primary dark:text-dark-txt-primary font-medium">Une erreur est survenue.</p>
            </div>
        </div>
    );
}
