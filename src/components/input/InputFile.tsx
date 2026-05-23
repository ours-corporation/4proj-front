'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";

type InputFileProps = {
    id: string;
    name?: string;
    label: string;
    value: File[];
    required?: boolean;
    accept?: string;
    onChange: (files: File[]) => void;
};

export default function InputFile({ id, name, label, value = [], required, accept, onChange }: InputFileProps) {
    const files = Array.isArray(value) ? value : [];
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const mergeFiles = (existing: File[], incoming: FileList): File[] => {
        const safeExisting = Array.isArray(existing) ? existing : [];
        const existingNames = new Set(safeExisting.map((f) => f.name));
        const newFiles = Array.from(incoming).filter((f) => !existingNames.has(f.name));
        return [...safeExisting, ...newFiles].slice(0, 50);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) { onChange(mergeFiles(files, e.target.files)); e.target.value = ""; }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) onChange(mergeFiles(files, e.dataTransfer.files));
    };

    const handleRemoveFile = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        onChange(files.filter((_, i) => i !== index));
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="w-full">
            <label className="block text-[11px] font-medium text-txt-secondary dark:text-[#555] mb-1.5 uppercase tracking-wider" htmlFor={id}>
                {label} {required && <span className="text-[#ef5350]">*</span>}
            </label>

            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
                className={`relative flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed transition-all ${
                    isDragging
                        ? "border-[#7c6ef8]/60 bg-[#7c6ef8]/[0.06]"
                        : "border-border-subtle dark:border-white/[0.08] bg-surface-hover dark:bg-[#0d0d0d] hover:border-[#7c6ef8]/40 hover:bg-[#7c6ef8]/[0.03]"
                }`}
            >
                <input ref={inputRef} id={id} name={name} type="file" accept={accept} required={required && files.length === 0} onChange={handleInputChange} className="hidden" multiple />

                <div className="flex flex-col items-center p-5 text-center">
                    <svg className={`mb-3 h-8 w-8 ${isDragging ? "text-[#7c6ef8]" : "text-[#9CA3AF] dark:text-[#333]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-sm text-txt-secondary dark:text-[#888]">
                        <span className="font-medium text-txt-primary dark:text-[#ccc]">Cliquez</span> ou glissez vos fichiers ici
                    </p>
                    <p className="text-xs text-txt-secondary dark:text-[#444] mt-1">
                        {files.length > 0
                            ? `${files.length} fichier${files.length > 1 ? "s" : ""} sélectionné${files.length > 1 ? "s" : ""}`
                            : "Tous types de fichiers acceptés"}
                    </p>
                </div>
            </div>

            {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                    {files.map((file, index) => (
                        <li key={`${file.name}-${index}`} className="flex items-center justify-between rounded-[8px] border border-border-subtle dark:border-white/[0.06] bg-surface-hover dark:bg-[#0d0d0d] px-3 py-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <svg className="h-4 w-4 shrink-0 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="overflow-hidden">
                                    <p className="truncate text-sm text-txt-primary dark:text-[#ccc]">{file.name}</p>
                                    <p className="text-xs text-txt-secondary dark:text-[#444]">{formatSize(file.size)}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleRemoveFile(e, index)}
                                className="ml-3 shrink-0 px-2 py-1 text-xs text-[#ef5350] hover:bg-[#ef5350]/[0.08] rounded-[6px] transition-colors"
                            >
                                Retirer
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
