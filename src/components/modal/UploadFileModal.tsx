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
        if (!result.success) { setFileError(result.error.issues[0].message); return; }
        setIsUploading(true);
        setUploadProgress(0);
        try {
            const rep = await uploadFilesAPI(files, parentFolderId, setUploadProgress);
            if (rep.ok) { setFiles([]); onSuccess(); onClose(); }
        } finally { setIsUploading(false); setUploadProgress(0); }
    }

    function handleClose() { if (isUploading) return; setFiles([]); setFileError(''); onClose(); }

    return (
        <Modal size="small" title="Importer des fichiers" isOpen={isOpen} onClose={handleClose}>
            <div className="space-y-5">
                <InputFile
                    id="file-upload"
                    label="Fichiers"
                    value={files}
                    onChange={setFiles}
                    accept="*/*"
                    required
                />
                {fileError && (
                    <p className="text-[13px] text-[#ef5350] px-3 py-2 bg-[#ef5350]/[0.08] border border-[#ef5350]/20 rounded-[8px]">{fileError}</p>
                )}
                {isUploading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-[13px]">
                            <span className="text-[#888]">Upload en cours…</span>
                            <span className="font-semibold text-[#ededed]">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] h-full rounded-full transition-all duration-200 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}
                <SubmitButton
                    id="add-file-button"
                    type="button"
                    text="Importer"
                    loading={isUploading}
                    loadingText="Upload en cours…"
                    onClick={handleUpload}
                    className="w-full py-3 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-[14px] font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                />
            </div>
        </Modal>
    );
}
