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

export default function InputFile({
    id,
    name,
    label,
    value = [],
    required,
    accept,
    onChange,
}: InputFileProps) {
    const files = Array.isArray(value) ? value : [];
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleZoneClick = () => {
        inputRef.current?.click();
    };

    const mergeFiles = (existing: File[], incoming: FileList): File[] => {
        const safeExisting = Array.isArray(existing) ? existing : [];
        const existingNames = new Set(safeExisting.map((f) => f.name));
        const newFiles = Array.from(incoming).filter((f) => !existingNames.has(f.name));
        return [...safeExisting, ...newFiles].slice(0, 50);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onChange(mergeFiles(files, e.target.files));
            e.target.value = "";
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onChange(mergeFiles(files, e.dataTransfer.files));
        }
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
            <label
                className="mb-2 block text-sm font-medium text-txt-primary dark:text-dark-txt-primary"
                htmlFor={id}
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {/* Zone de drop */}
            <div
                onClick={handleZoneClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors
                    ${isDragging
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-border-subtle bg-input-bg hover:bg-gray-50 dark:border-dark-border-subtle dark:bg-dark-input-bg dark:hover:bg-gray-800"
                    }
                `}
            >
                <input
                    ref={inputRef}
                    id={id}
                    name={name}
                    type="file"
                    accept={accept}
                    required={required && files.length === 0}
                    onChange={handleInputChange}
                    className="hidden"
                    multiple
                />

                <div className="flex flex-col items-center p-4 text-center">
                    <svg
                        className={`mb-3 h-8 w-8 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-1 text-sm text-txt-primary dark:text-dark-txt-primary">
                        <span className="font-semibold">Cliquez pour upload</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {files.length > 0
                            ? `${files.length} fichier${files.length > 1 ? "s" : ""} sélectionné${files.length > 1 ? "s" : ""} — ajouter d'autres`
                            : "SVG, PNG, JPG ou PDF (MAX. 10MB)"}
                    </p>
                </div>
            </div>

            {/* Liste des fichiers */}
            {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                    {files.map((file, index) => (
                        <li
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between rounded-lg border border-border-subtle bg-input-bg px-3 py-2 dark:border-dark-border-subtle dark:bg-dark-input-bg"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <svg className="h-5 w-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="overflow-hidden">
                                    <p className="truncate text-sm font-medium text-txt-primary dark:text-dark-txt-primary">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleRemoveFile(e, index)}
                                className="ml-3 shrink-0 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
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
