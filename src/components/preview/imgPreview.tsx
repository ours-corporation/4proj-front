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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if(!file) {
        return <div>Chargement de l&#39;aperçu...</div>;
    }
    return (
        <div className="space-y-6">
            <div className="relative w-full h-64 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden group">
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

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Métadonnées
                </h3>
                <dl className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                    <div>
                        <dt className="text-gray-500 mb-1">Nom du fichier</dt>
                        <dd className="font-medium text-gray-900 truncate" title={fileInformation.name}>
                            {fileInformation.name}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-gray-500 mb-1">Taille</dt>
                        <dd className="font-medium text-gray-900">
                            {convertFileSize(fileInformation.size_bytes)}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-gray-500 mb-1">Type MIME</dt>
                        <dd className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {fileInformation.mime_type}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-gray-500 mb-1">Modifié le</dt>
                        <dd className="font-medium text-gray-900">
                            {formatDate(fileInformation.updated_at)}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}