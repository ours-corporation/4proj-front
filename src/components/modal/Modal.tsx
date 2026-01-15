import React from 'react';

interface ModalProps {
    isOpen: boolean;
    title?: string;
    children?: React.ReactNode;
    onClose: () => void;
}

export default function Modal({ isOpen, title, children, onClose }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <h2 className="text-xl font-semibold mb-4">
                        {title}
                    </h2>
                )}

                <div className="mb-6">
                    {children}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}
