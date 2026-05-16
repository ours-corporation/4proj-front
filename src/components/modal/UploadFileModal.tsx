'use client';

import { useState } from 'react';
import Modal from '@/src/components/modal/Modal';
import InputFile from '@/src/components/input/InputFile';
import SubmitButton from '@/src/components/button/SubmitButton';
import { uploadFilesAPI } from '@/src/api/file';
import { addFileValidator } from '@/src/validator/file';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    parentFolderId: number | null;
    onSuccess: () => void;
}

export default function UploadFileModal({ isOpen, onClose, parentFolderId, onSuccess }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    async function handleUpload() {
        setFileError('');
        const result = addFileValidator.safeParse({ files });
        if (!result.success) {
            setFileError(result.error.issues[0].message);
            return;
        }
        setIsUploading(true);
        setUploadProgress(0);
        try {
            const rep = await uploadFilesAPI(files, parentFolderId, setUploadProgress);
            if (rep.ok) {
                setFiles([]);
                onSuccess();
                onClose();
            }
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    }

    function handleClose() {
        if (isUploading) return;
        setFiles([]);
        setFileError('');
        onClose();
    }

    return (
        <Modal size="small" title="Ajouter un fichier" isOpen={isOpen} onClose={handleClose}>
            <div className="space-y-6">
                <InputFile
                    id="file-upload"
                    label="Sélectionner un fichier"
                    value={files}
                    onChange={setFiles}
                    accept="*/*"
                    required
                />
                {fileError && (
                    <p className="text-error dark:text-dark-error text-sm">{fileError}</p>
                )}
                {isUploading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-txt-primary dark:text-dark-txt-primary">
                            <span>Upload en cours...</span>
                            <span className="font-semibold">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-main-bg dark:bg-dark-main-bg rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-action dark:bg-dark-action h-2 rounded-full transition-all duration-200 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}
                <SubmitButton
                    id="add-file-button"
                    type="button"
                    text="Ajouter le fichier"
                    loading={isUploading}
                    loadingText="Upload en cours..."
                    onClick={handleUpload}
                />
            </div>
        </Modal>
    );
}
