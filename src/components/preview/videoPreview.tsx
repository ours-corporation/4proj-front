import React, {useEffect, useMemo, useState} from 'react';
import { FileResponse } from "@/src/interface/file";
import { convertFileSize } from "@/src/utils/convert-file-size";

interface VideoPreviewProps {
    fileInformation: FileResponse;
    file: File;
    onClose?: () => void;
}

export default function VideoPreview({ fileInformation, file }: VideoPreviewProps) {

    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
        if (!file) return;

        // On crée l'URL
        const objectUrl = URL.createObjectURL(file);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreviewUrl(objectUrl);

        // 2. Nettoyage : On ne révoque que CETTE url spécifique quand le fichier change ou le composant meurt
        return () => {
            URL.revokeObjectURL(objectUrl);
            setPreviewUrl(''); // Optionnel, mais propre
        };
    }, [file]); // Dépendance : file

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (!file) {
        return <div className="p-4 text-center text-gray-500">Chargement de la vidéo...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="relative w-full bg-main-bg dark:bg-dark-main-bg rounded-xl border border-border-subtle dark:border-dark-border-subtle overflow-hidden group p-2">
                <div className="w-full flex items-center justify-center max-w-md mx-auto">
                    <video
                        className="w-full h-full object-contain"
                        controls
                        controlsList="nodownload"
                        src={previewUrl}
                    >
                        Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                </div>
            </div>
        </div>
    );
}