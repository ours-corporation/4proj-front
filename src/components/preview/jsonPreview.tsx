import React, { useEffect, useState } from 'react';
import { FileResponse } from "@/src/interface/file";

interface JsonPreviewProps {
    fileInformation: FileResponse;
    file: File;
    onClose?: () => void;
}

function colorizeJson(json: string): React.ReactNode[] {
    const tokens = json.split(/("(?:[^"\\]|\\.)*"(?:\s*:)?|true|false|null|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g);
    return tokens.map((token, i) => {
        if (/^".*":$/.test(token.trimEnd())) {
            const colon = token.endsWith(':') ? ':' : '';
            const key = token.slice(0, token.lastIndexOf(':'));
            return <span key={i}><span className="text-blue-600 dark:text-blue-400">{key}</span>{colon}</span>;
        }
        if (/^"/.test(token)) return <span key={i} className="text-green-600 dark:text-green-400">{token}</span>;
        if (token === 'true' || token === 'false') return <span key={i} className="text-purple-600 dark:text-purple-400">{token}</span>;
        if (token === 'null') return <span key={i} className="text-red-500 dark:text-red-400">{token}</span>;
        if (/^-?\d/.test(token)) return <span key={i} className="text-orange-500 dark:text-orange-400">{token}</span>;
        return <span key={i} className="text-gray-700 dark:text-gray-300">{token}</span>;
    });
}

export default function JsonPreview({ fileInformation, file }: JsonPreviewProps) {
    const [formatted, setFormatted] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!file) return;

        setLoading(true);
        setError('');
        const reader = new FileReader();
        reader.onload = (e) => {
            const raw = e.target?.result as string ?? '';
            try {
                const parsed = JSON.parse(raw);
                setFormatted(JSON.stringify(parsed, null, 2));
            } catch {
                setError('JSON invalide');
                setFormatted(raw);
            }
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
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                        </svg>
                        <span className="text-xs text-gray-500 font-mono">{fileInformation.name}.{fileInformation.extension}</span>
                    </div>
                    {error && (
                        <span className="text-xs text-red-500 font-medium">{error}</span>
                    )}
                </div>
                <div className="h-[360px] overflow-auto p-4">
                    <pre className="text-sm font-mono leading-relaxed">
                        {error
                            ? <span className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{formatted}</span>
                            : colorizeJson(formatted)
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
}
