import React, { useState } from 'react';
import Modal from "@/src/components/modal/Modal";
import { deleteTrash, DeleteTrashResponse } from '@/src/api/trash';
interface DeleteTrashModalProps {
    isOpen?: boolean;
    closeModal: () => void;

}

export default function DeleteTrashModal({ isOpen, closeModal }: DeleteTrashModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [forceDelete, setForceDelete] = useState(false);

    if (!isOpen) return null;

    async function handleDelete() {

        if(!forceDelete){
            setError("cocher la case si vous voullez vraiment supprimer l'intégralité de la corbeille.");
            return;
        }
        setLoading(true);
        setError(null);

        try{
            await deleteTrash();
            closeModal();
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
        title="Supprimer la corbeille"
        size="small"
    >
        <div className="flex flex-col gap-4">
            <p className="text-sm text-txt-primary dark:text-dark-txt-primary">
                Êtes-vous sûr de vouloir supprimer l'entiéreté de la corbeille
            </p>

            <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                    type="checkbox"
                    checked={forceDelete}
                    onChange={(e) => setForceDelete(e.target.checked)}
                    className="w-4 h-4 accent-red-600 cursor-pointer"
                />
                <span className="text-sm text-txt-primary dark:text-dark-txt-primary">
                    J’accepte la suppression définitive et irréversible de mes données.
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