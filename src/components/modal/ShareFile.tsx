import React, { useState } from 'react';
import Modal from "@/src/components/modal/Modal";
import { FileResponse } from "@/src/interface/file";
import { FolderResponse } from "@/src/interface/folder";
import PublicShare from "@/src/components/share/PublicShare";
import PrivateShare from "@/src/components/share/PrivateShare";


interface ShareFileModalProps {
    isOpen?: boolean;
    fileInfo?: FileResponse;
    folderInfo?: FolderResponse;
    closeModal: () => void;
}

export default function ShareFileModal({ isOpen, fileInfo, folderInfo, closeModal }: ShareFileModalProps) {
    const [visibility, setVisibility] = useState<'public' | 'internal'>('public');

    if (!fileInfo && !folderInfo) return null;

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title="Partager le fichier"
            size="small"
        >
            <div className="flex flex-col gap-4 py-4">
                {/* Switch de sélection */}
                <div className="flex bg-main-bg dark:bg-dark-main-bg p-1 rounded-lg select-none">
                    <button
                        onClick={() => setVisibility('public')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                            visibility === 'public'
                                ? 'bg-surface dark:bg-dark-surface text-action dark:text-dark-action shadow-sm'
                                : 'text-txt-secondary dark:text-dark-txt-secondary hover:text-action dark:hover:text-dark-action'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        Partage Public
                    </button>

                    <button
                        onClick={() => setVisibility('internal')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                            visibility === 'internal'
                                ? 'bg-surface dark:bg-dark-surface text-action dark:text-dark-action shadow-sm'
                                : 'text-txt-secondary dark:text-dark-txt-secondary hover:text-action dark:hover:text-dark-action'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        Partage Utilisateurs
                    </button>
                </div>

                {visibility === 'public' ? (
                    <PublicShare
                        fileInfo={fileInfo}
                        folderInfo={folderInfo}
                    />
                ) : (
                    <PrivateShare
                        fileInfo={fileInfo}
                        folderInfo={folderInfo}
                    />
                )}

            </div>
        </Modal>
    );
}