import { useState, useEffect } from 'react';
import Modal from "@/src/components/modal/Modal";
import { FolderResponse } from "@/src/interface/folder";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";
import { renameFolderById } from "@/src/api/folders";

interface RenameFolderModalProps {
    isOpen?: boolean;
    folderInfo: FolderResponse;
    closeModal: () => void;
    onSuccess?: () => void;
}

export default function RenameFolderModal({ isOpen, folderInfo, closeModal, onSuccess }: RenameFolderModalProps) {
    const [folderName, setFolderName] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (folderInfo?.name) {
            setFolderName(folderInfo.name);
        }
    }, [folderInfo]);

    async function handleRename() {
        if (!folderName.trim()) {
            setErrorMessage("Le nom du dossier ne peut pas être vide.");
            return;
        }
        setLoading(true);
        try {
            await renameFolderById(folderInfo.id, folderName.trim());
            closeModal();
            onSuccess?.();
        } catch {
            setErrorMessage("Une erreur est survenue lors du renommage.");
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title="Renommer le dossier"
            size="small"
        >
            <div className="flex flex-col">
                <InputField
                    id="folder-name"
                    label="Nom du dossier"
                    value={folderName}
                    type="text"
                    onChange={setFolderName}
                />

                {errorMessage && (
                    <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
                )}

                <div className="mt-4 flex justify-end w-full">
                    <SubmitButton
                        id="rename-folder-button"
                        type="button"
                        text="Renommer"
                        loadingText="Renommage..."
                        loading={loading}
                        onClick={handleRename}
                    />
                </div>
            </div>
        </Modal>
    );
}
