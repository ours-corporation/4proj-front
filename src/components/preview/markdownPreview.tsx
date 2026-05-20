import React, { useEffect, useState } from 'react';
import { FileResponse } from "@/src/interface/file";
import MarkdownPreview from '@uiw/react-markdown-preview';

interface markdownPreviewProps {
    fileInformation: FileResponse;
    file: File;
    onClose?: () => void;
}



export default function MardownPrev({ fileInformation, file }: markdownPreviewProps ){

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
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-surface dark:bg-dark-surface">
                    <div className="flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>

                        <span className="text-xs text-gray-500 font-mono">{fileInformation.name}.{fileInformation.extension}</span>
                    </div>  
                </div>
                <div className="h-[360px] overflow-auto p-4"> 
                    <MarkdownPreview source={content} style={{ padding: 16 }} /> 
                </div>
            </div>
        </div>
    )

}