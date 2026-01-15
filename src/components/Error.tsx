import React from 'react';

interface InputProps {
    errorCode?: string | number;
    errorMsg?: string;
}

export default function Error({ errorCode, errorMsg }: InputProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-lg p-8">
                <h1 className="text-2xl font-bold text-red-500 dark:text-gray-100 mb-4">
                    {errorCode ? `${errorCode} - ` : ''}{errorMsg || 'Une erreur inattendue est survenue.'}
                </h1>
                <p className="text-gray-700 dark:text-gray-300">
                    Veuillez réessayer ou contacter le support si le problème persiste.
                </p>
            </div>
        </div>
    );
}
