import React, { useState } from 'react';
import Modal from "@/src/components/modal/Modal";

interface DeleteModalProps {
    isOpen?: boolean;
    title: string;
    message: React.ReactNode;
    closeModal: () => void;
    onConfirm: (forceDelete: boolean) => Promise<void>;
    checkboxLabel?: string;
    requireCheckbox?: boolean;
}

export default function DeleteModal({ isOpen, title, message, closeModal, onConfirm, checkboxLabel, requireCheckbox }: DeleteModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);

    if (!isOpen) return null;

    async function handleDelete() {
        if (requireCheckbox && !checked) {
            setError("Cochez la case pour confirmer la suppression.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await onConfirm(checked);
            closeModal();
        } catch {
            setError("Une erreur est survenue lors de la suppression.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title={title} size="small">
            <div className="flex flex-col gap-4">
                <p className="text-sm text-txt-primary dark:text-dark-txt-primary">{message}</p>

                {checkboxLabel && (
                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                            className="w-4 h-4 accent-red-600 cursor-pointer"
                        />
                        <span className="text-sm text-txt-primary dark:text-dark-txt-primary">{checkboxLabel}</span>
                    </label>
                )}

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={closeModal}
                        disabled={loading}
                        className="px-4 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 text-txt-primary dark:text-dark-txt-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {loading ? "Suppression..." : "Supprimer"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
