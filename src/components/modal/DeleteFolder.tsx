import React, { useState } from 'react';
import Modal from "@/src/components/modal/Modal";
import { FolderResponse } from "@/src/interface/folder";
import { deleteFolderById } from "@/src/api/folders";

interface DeleteFolderModalProps {
    isOpen?: boolean;
    folderInfo?: FolderResponse;
    closeModal: () => void;
    onSuccess?: () => void;
}

export default function DeleteFolderModal({ isOpen, closeModal, folderInfo, onSuccess }: DeleteFolderModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [forceDelete, setForceDelete] = useState(false);

    if (!folderInfo) return null;
    if (!isOpen) return null;

    async function handleDelete() {
        setLoading(true);
        setError(null);
        try {
            await deleteFolderById(folderInfo!.id, forceDelete);
            closeModal();
            onSuccess?.();
        } catch {
            setError("Une erreur est survenue lors de la suppression.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title="Supprimer le dossier"
            size="small"
        >
            <div className="flex flex-col gap-4">
                <p className="text-sm text-txt-primary dark:text-dark-txt-primary">
                    Êtes-vous sûr de vouloir supprimer{" "}
                    <span className="font-semibold">{folderInfo.name}</span> ?
                </p>

                <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <input
                        type="checkbox"
                        checked={forceDelete}
                        onChange={(e) => setForceDelete(e.target.checked)}
                        className="w-4 h-4 accent-red-600 cursor-pointer"
                    />
                    <span className="text-sm text-txt-primary dark:text-dark-txt-primary">
                        Suppression forcée
                    </span>
                </label>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

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
