import React, { useEffect, useState } from 'react';
import { FileResponse } from "@/src/interface/file";
import { convertFileSize } from "@/src/utils/convert-file-size";

interface AudioPreviewProps {
    fileInformation: FileResponse;
    file: File;
    onClose?: () => void;
}

export default function AudioPreview({ fileInformation, file }: AudioPreviewProps) {

    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
        if (!file) return;

        // Création de l'URL pour le fichier audio
        const objectUrl = URL.createObjectURL(file);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreviewUrl(objectUrl);

        // Nettoyage lors du démontage ou changement de fichier
        return () => {
            URL.revokeObjectURL(objectUrl);
            setPreviewUrl('');
        };
    }, [file]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (!file) {
        return <div className="p-4 text-center text-gray-500">Chargement de l'audio...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="relative w-full bg-main-bg dark:bg-dark-main-bg rounded-xl border border-gray-200 overflow-hidden group">
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

                    <audio
                        className="w-full max-w-md h-12"
                        controls
                        controlsList="nodownload"
                        src={previewUrl}
                    >
                        Votre navigateur ne supporte pas la lecture de fichiers audio.
                    </audio>
                </div>
            </div>
        </div>
    );
}