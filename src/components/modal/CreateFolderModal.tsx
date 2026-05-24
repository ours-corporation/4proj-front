'use client';

import { useState } from 'react';
import Modal from '@/src/components/modal/Modal';
import InputField from '@/src/components/input/InputField';
import SubmitButton from '@/src/components/button/SubmitButton';
import { createNewFolderAPI } from '@/src/api/folders';
import { createNewFolderValidator } from '@/src/validator/folder';

const inputWrapper = "mt-1 w-full bg-input-bg dark:bg-[#0d0d0d] border border-border-subtle dark:border-white/[0.08] rounded-[10px] px-4 py-3 flex items-center transition-all focus-within:border-[#7c6ef8]/50 focus-within:ring-1 focus-within:ring-[#7c6ef8]/20";
const inputInner = "flex-grow bg-transparent focus:outline-none p-0 border-none ring-0 text-txt-primary dark:text-[#ededed] text-sm placeholder:text-[#9CA3AF] dark:placeholder:text-[#333]";
const labelClass = "block text-[11px] font-medium text-txt-secondary dark:text-[#555] mb-1.5 uppercase tracking-wider";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    parentFolderId: number | null;
    onSuccess: () => void;
}

export default function CreateFolderModal({ isOpen, onClose, parentFolderId, onSuccess }: Props) {
    const [folderName, setFolderName] = useState('');
    const [folderNameError, setFolderNameError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleCreate() {
        setFolderNameError('');
        const result = createNewFolderValidator.safeParse({ name: folderName });
        if (!result.success) { setFolderNameError(result.error.issues[0].message); return; }
        setLoading(true);
        try {
            await createNewFolderAPI(folderName, parentFolderId);
            setFolderName('');
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Erreur lors de la création du dossier :', err);
        } finally {
            setLoading(false);
        }
    }

    function handleClose() { setFolderName(''); setFolderNameError(''); onClose(); }

    return (
        <Modal size="small" isOpen={isOpen} title="Nouveau dossier" onClose={handleClose}>
            <div className="space-y-5">
                <InputField
                    id="new-folder-name"
                    label="Nom du dossier"
                    value={folderName}
                    type="text"
                    placeholder="Mon dossier"
                    onChange={setFolderName}
                    labelClassName={labelClass}
                    wrapperClassName={inputWrapper}
                    inputClassName={inputInner}
                />
                {folderNameError && (
                    <p className="text-[13px] text-[#ef5350] px-3 py-2 bg-[#ef5350]/[0.08] border border-[#ef5350]/20 rounded-[8px]">{folderNameError}</p>
                )}
                <SubmitButton
                    id="create-folder-button"
                    type="button"
                    text="Créer le dossier"
                    loadingText="Création..."
                    loading={loading}
                    onClick={handleCreate}
                    className="w-full py-3 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-[14px] font-medium hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
        </Modal>
    );
}
