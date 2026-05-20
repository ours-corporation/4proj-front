'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FileResponse } from "@/src/interface/file";
import { getJwtToken } from "@/src/hooks/getJwtInformation";

interface VideoPreviewProps {
    fileInformation: FileResponse;
    onClose?: () => void;
}

// MediaSource ne fonctionne qu'avec des formats fragmentés (webm, fmp4).
// Pour les MP4 classiques (moov à la fin), on streame la réponse avec un suivi de progression.
const MSE_COMPATIBLE = ['video/webm', 'video/ogg'];

export default function VideoPreview({ fileInformation }: VideoPreviewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const token = getJwtToken();
        const streamUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/files/${fileInformation.id}/stream`;
        const mimeType = fileInformation.mime_type;
        const totalSize = fileInformation.size_bytes;
        let aborted = false;
        let objectUrl = '';

        const cleanup = () => {
            aborted = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };

        const usesMSE = MSE_COMPATIBLE.includes(mimeType) &&
            typeof MediaSource !== 'undefined' &&
            MediaSource.isTypeSupported(mimeType);

        if (usesMSE) {
            // Streaming natif via MediaSource (webm/ogg uniquement)
            const CHUNK = 5 * 1024 * 1024;
            const mediaSource = new MediaSource();
            objectUrl = URL.createObjectURL(mediaSource);
            video.src = objectUrl;

            let sourceBuffer: SourceBuffer;
            let fetchOffset = 0;
            const pending: ArrayBuffer[] = [];
            let isAppending = false;

            const tryAppend = () => {
                if (isAppending || pending.length === 0 || !sourceBuffer || sourceBuffer.updating) return;
                isAppending = true;
                try { sourceBuffer.appendBuffer(pending.shift()!); } catch { isAppending = false; }
            };

            const fetchChunk = async (offset: number) => {
                if (aborted || offset >= totalSize) {
                    if (!aborted && mediaSource.readyState === 'open') mediaSource.endOfStream();
                    setReady(true);
                    return;
                }
                const end = Math.min(offset + CHUNK - 1, totalSize - 1);
                try {
                    const res = await fetch(streamUrl, {
                        headers: { Authorization: `Bearer ${token}`, Range: `bytes=${offset}-${end}` },
                    });
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const buf = await res.arrayBuffer();
                    if (aborted) return;
                    fetchOffset = end + 1;
                    setProgress(Math.round((fetchOffset / totalSize) * 100));
                    pending.push(buf);
                    tryAppend();
                } catch {
                    if (!aborted) setError('Erreur lors du streaming vidéo');
                }
            };

            mediaSource.addEventListener('sourceopen', () => {
                sourceBuffer = mediaSource.addSourceBuffer(mimeType);
                sourceBuffer.addEventListener('updateend', () => {
                    isAppending = false;
                    if (!ready) setReady(true);
                    if (pending.length > 0) tryAppend();
                    else fetchChunk(fetchOffset);
                });
                fetchChunk(0);
            });
        } else {
            // Fetch progressif avec suivi de progression (MP4 classique et autres formats)
            (async () => {
                try {
                    const res = await fetch(streamUrl, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);

                    const contentLength = parseInt(res.headers.get('Content-Length') || String(totalSize), 10);
                    const reader = res.body?.getReader();
                    if (!reader) throw new Error('Stream non disponible');

                    const chunks: Uint8Array<ArrayBuffer>[] = [];
                    let received = 0;

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done || aborted) break;
                        chunks.push(value);
                        received += value.byteLength;
                        if (contentLength > 0) setProgress(Math.round((received / contentLength) * 100));
                    }

                    if (aborted) return;

                    const blob = new Blob(chunks as BlobPart[], { type: mimeType });
                    objectUrl = URL.createObjectURL(blob);
                    video.src = objectUrl;
                    setReady(true);
                } catch {
                    if (!aborted) setError('Impossible de charger la vidéo');
                }
            })();
        }

        return cleanup;
    }, [fileInformation.id, fileInformation.mime_type, fileInformation.size_bytes]);

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="relative w-full bg-main-bg dark:bg-dark-main-bg rounded-xl border border-border-subtle dark:border-dark-border-subtle overflow-hidden p-2">
                <div className="w-full flex items-center justify-center max-w-md mx-auto">
                    {!ready && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-main-bg dark:bg-dark-main-bg rounded-xl z-10">
                            <svg className="w-8 h-8 animate-spin text-action dark:text-dark-action" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            {progress > 0 && (
                                <div className="w-40">
                                    <div className="w-full bg-border-subtle dark:bg-dark-border-subtle rounded-full h-1.5">
                                        <div
                                            className="bg-action dark:bg-dark-action h-1.5 rounded-full transition-all duration-200"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-txt-secondary dark:text-dark-txt-secondary text-center mt-1">
                                        {progress}%
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain"
                        controls
                        controlsList="nodownload"
                    >
                        Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                </div>
            </div>
        </div>
    );
}
