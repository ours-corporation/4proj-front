import React, { useEffect, useMemo } from 'react';
import { FileResponse } from "@/src/interface/file";
import { convertFileSize} from "@/src/utils/convert-file-size";

interface ImgPreviewProps {
    fileInformation: FileResponse;
    file: File;
    onClose?: () => void;
}

export default function ImgPreview({ fileInformation, file }: ImgPreviewProps) {

    const previewUrl = useMemo(() => {
        if (!file) return '';
        return URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    if(!file) {
        return <div>Chargement de l&#39;aperçu...</div>;
    }
    return (
        <div className="space-y-6">
            <div className="relative w-full h-64 bg-main-bg dark:bg-dark-main-bg rounded-xl border border-border-subtle dark:border-dark-border-subtle flex items-center justify-center overflow-hidden group p-2">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '10px 10px'
                }}></div>

                <img
                    src={previewUrl}
                    alt={fileInformation.name}
                    className="max-w-full max-h-full object-contain shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
            </div>
        </div>
    );
}