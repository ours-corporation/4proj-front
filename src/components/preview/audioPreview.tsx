'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FileResponse } from "@/src/interface/file";
import { getJwtToken } from "@/src/hooks/getJwtInformation";

interface AudioPreviewProps {
    fileInformation: FileResponse;
    onClose?: () => void;
}

export default function AudioPreview({ fileInformation }: AudioPreviewProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = getJwtToken();
        const streamUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/files/${fileInformation.id}/stream`;
        let aborted = false;
        let objectUrl = '';

        (async () => {
            try {
                const res = await fetch(streamUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const blob = await res.blob();
                if (aborted) return;
                objectUrl = URL.createObjectURL(blob);
                if (audioRef.current) audioRef.current.src = objectUrl;
                setReady(true);
            } catch {
                if (!aborted) setError('Impossible de charger le fichier audio');
            }
        })();

        return () => {
            aborted = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [fileInformation.id]);

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="relative w-full bg-main-bg dark:bg-dark-main-bg rounded-xl border border-border-subtle dark:border-dark-border-subtle overflow-hidden group">
                <div className="h-[300px] w-full flex flex-col items-center justify-center space-y-6 p-6">
                    <div className="bg-surface dark:bg-dark-surface p-6 rounded-full shadow-lg border border-border-subtle dark:border-dark-border-subtle">
                        <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                        </svg>
                    </div>

                    {!ready && (
                        <div className="flex flex-col items-center gap-3 text-gray-400">
                            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            <span className="text-sm">Chargement de l'audio...</span>
                        </div>
                    )}

                    <audio
                        ref={audioRef}
                        className="w-full max-w-md h-12"
                        controls
                        controlsList="nodownload"
                    >
                        Votre navigateur ne supporte pas la lecture de fichiers audio.
                    </audio>
                </div>
            </div>
        </div>
    );
}