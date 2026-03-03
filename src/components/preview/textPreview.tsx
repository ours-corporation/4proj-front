import React, { useEffect, useState } from 'react';
import { FileResponse } from "@/src/interface/file";

interface TextPreviewProps {
    fileInformation: FileResponse;
    file: File;
    onClose?: () => void;
}

export default function TextPreview({ fileInformation, file }: TextPreviewProps) {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!file) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            setContent(e.target?.result as string ?? '');
            setLoading(false);
        };
        reader.readAsText(file, 'UTF-8');
    }, [file]);


    if (!file || loading) {
        return <div className="p-4 text-center text-gray-500">Chargement du fichier...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="relative w-full bg-main-bg dark:bg-dark-main-bg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-surface dark:bg-dark-surface">
                    <svg
                        className="w-4 h-4 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>Su
                    <span className="text-xs text-gray-500 font-mono">{fileInformation.name}.{fileInformation.extension}</span>
                </div>
                <div className="h-[360px] overflow-auto p-4">
                    <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap break-words leading-relaxed">
                        {content || <span className="text-gray-400 italic">Fichier vide</span>}
                    </pre>
                </div>
            </div>
        </div>
    );
}
