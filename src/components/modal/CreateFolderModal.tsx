'use client';

import { useState } from 'react';
import Modal from '@/src/components/modal/Modal';
import InputField from '@/src/components/input/InputField';
import SubmitButton from '@/src/components/button/SubmitButton';
import { createNewFolderAPI } from '@/src/api/folders';
import { createNewFolderValidator } from '@/src/validator/folder';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    parentFolderId: number | null;
    onSuccess: () => void;
}

export default function CreateFolderModal({ isOpen, onClose, parentFolderId, onSuccess }: Props) {
    const [folderName, setFolderName] = useState('');
    const [folderNameError, setFolderNameError] = useState('');

    async function handleCreate() {
        setFolderNameError('');
        const result = createNewFolderValidator.safeParse({ name: folderName });
        if (!result.success) {
            setFolderNameError(result.error.issues[0].message);
            return;
        }
        try {
            await createNewFolderAPI(folderName, parentFolderId);
            setFolderName('');
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Erreur lors de la création du dossier :', err);
        }
    }

    function handleClose() {
        setFolderName('');
        setFolderNameError('');
        onClose();
    }

    return (
        <Modal size="small" isOpen={isOpen} title="Création d'un nouveau dossier" onClose={handleClose}>
            <div className="space-y-6">
                <InputField
                    id="new-folder-name"
                    label="Nom du dossier"
                    value={folderName}
                    type="text"
                    onChange={setFolderName}
                />
                {folderNameError && (
                    <p className="text-error dark:text-dark-error text-sm">{folderNameError}</p>
                )}
                <SubmitButton
                    id="create-folder-button"
                    type="button"
                    text="Créer le dossier"
                    onClick={handleCreate}
                />
            </div>
        </Modal>
    );
}
