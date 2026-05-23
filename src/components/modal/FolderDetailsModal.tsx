import React, { useState, useEffect } from 'react';
import Modal from '@/src/components/modal/Modal';
import { FolderResponse } from '@/src/interface/folder';
import { FileShareItem } from '@/src/interface/share';
import { getFolderShares } from '@/src/api/folders';
import SharesPanel from '@/src/components/SharesPanel';

interface FolderDetailsModalProps {
    isOpen: boolean;
    folder: FolderResponse | null;
    onClose: () => void;
}

export default function FolderDetailsModal({ isOpen, folder, onClose }: FolderDetailsModalProps) {
    const [shares, setShares] = useState<FileShareItem[]>([]);
    const [sharesLoading, setSharesLoading] = useState(false);
    const [sharesError, setSharesError] = useState(false);

    useEffect(() => {
        if (!isOpen || !folder) return;
        setSharesLoading(true);
        setSharesError(false);
        getFolderShares(folder.id)
            .then(setShares)
            .catch(() => setSharesError(true))
            .finally(() => setSharesLoading(false));
    }, [isOpen, folder]);

    function handleClose() {
        setShares([]);
        onClose();
    }

    // @ts-ignore
    return (
        <Modal
            isOpen={isOpen}
            title={folder ? folder.name : 'Droits d\'accès'}
            onClose={handleClose}
        >
            <div className="flex border-b border-border-subtle dark:border-dark-border-subtle -mt-2 mb-4">
                <div className="px-4 py-2 text-sm font-medium border-b-2 border-action dark:border-dark-action text-action dark:text-dark-action">
                    Droits d&apos;accès
                </div>
            </div>
            <SharesPanel
                shares={shares}
                setShares={setShares}
                sharesLoading={sharesLoading}
                sharesError={sharesError}
            />
        </Modal>
    );
}
