import React, { useEffect, useMemo } from 'react';
import { FileResponse } from "@/src/interface/file";
import { convertFileSize } from "@/src/utils/convert-file-size";

interface PdfPreviewProps {
    fileInformation: FileResponse;
    file: File;
    onClose?: () => void;
}

export default function PdfPreview({ fileInformation, file }: PdfPreviewProps) {

    const previewUrl = useMemo(() => {
        if (!file) return '';
        const pdfBlob = new Blob([file], { type: 'application/pdf' });
        return URL.createObjectURL(pdfBlob);
    }, [file]);

    useEffect(() => {
        // Nettoyage de l'URL objet pour éviter les fuites de mémoire
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (!file) {
        return <div className="p-4 text-center text-gray-500">Chargement du document...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="relative w-full bg-main-bg dark:bg-dark-main-bg rounded-xl border border-border-subtle dark:border-dark-border-subtle overflow-hidden group p-2">
                <div className="h-[500px] w-full">
                    <iframe
                        src={`${previewUrl}#toolbar=0&navpanes=0`}
                        title={fileInformation.name}
                        className="w-full h-full"
                        style={{ border: 'none' }}
                    >
                    </iframe>
                </div>
            </div>
        </div>
    );
}