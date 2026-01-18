import React, { useState, useRef, ChangeEvent, DragEvent } from "react";

type InputFileProps = {
    id: string;
    name?: string;
    label: string;
    value: File | null; // Le fichier actuellement sélectionné
    required?: boolean;
    accept?: string; // Ex: "image/*, .pdf"
    onChange: (file: File | null) => void;
};

export default function InputFile({
                                      id,
                                      name,
                                      label,
                                      value,
                                      required,
                                      accept,
                                      onChange
                                  }: InputFileProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fonction pour gérer le clic sur la zone de drop
    const handleZoneClick = () => {
        inputRef.current?.click();
    };

    // Gestion du changement via l'input classique
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onChange(e.target.files[0]);
        }
    };

    // Gestion du Drag Over (Quand on survole la zone avec un fichier)
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    // Gestion du Drag Leave (Quand on quitte la zone)
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // Gestion du Drop (Quand on relâche le fichier)
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onChange(e.dataTransfer.files[0]);
            // Optionnel : réinitialiser l'input ref si besoin
        }
    };

    // Fonction pour supprimer le fichier sélectionné
    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation(); // Empêche d'ouvrir la fenêtre de fichier
        onChange(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="w-full">
            <label
                className="mb-2 block text-sm font-medium text-txt-primary dark:text-dark-txt-primary"
                htmlFor={id}
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div
                onClick={handleZoneClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative flex min-h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors
                    ${isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-border-subtle bg-input-bg hover:bg-gray-50 dark:border-dark-border-subtle dark:bg-dark-input-bg dark:hover:bg-gray-800"
                }
                `}
            >
                {/* Input caché mais fonctionnel */}
                <input
                    ref={inputRef}
                    id={id}
                    name={name}
                    type="file"
                    accept={accept}
                    required={required && !value} // Requis seulement si pas de valeur
                    onChange={handleInputChange}
                    className="hidden"
                />

                {/* Contenu visuel conditionnel */}
                {value ? (
                    <div className="flex flex-col items-center p-4 text-center">
                        <svg className="mb-2 h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-txt-primary dark:text-dark-txt-primary">
                            {value.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(value.size / 1024).toFixed(2)} KB
                        </p>
                        <button
                            onClick={handleRemoveFile}
                            className="mt-2 rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                        >
                            Retirer le fichier
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center p-4 text-center">
                        <svg
                            className={`mb-3 h-10 w-10 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
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
                            SVG, PNG, JPG ou PDF (MAX. 10MB)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}