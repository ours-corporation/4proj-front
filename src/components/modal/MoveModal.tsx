import { useState, useEffect } from 'react';
import Modal from "@/src/components/modal/Modal";
import { FolderResponse } from '@/src/interface/folder';
import SubmitButton from "@/src/components/button/SubmitButton";
import { getFolderById, getRootFolder } from '@/src/api/folders';

interface MoveModalProps {
    isOpen?: boolean;
    title: string;
    itemLabel: string;
    itemName: string;
    parentId?: number | null;
    excludeId?: number;
    closeModal: () => void;
    onMove: (destinationId: string | null) => Promise<void>;
}

export default function MoveModal({ isOpen, title, itemLabel, itemName, parentId, excludeId, closeModal, onMove }: MoveModalProps) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [folder, setFolder] = useState<FolderResponse | null>(null);
    const [subFolders, setSubFolders] = useState<FolderResponse[]>([]);
    const [selected, setSelected] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        setErrorMessage(null);
        const fetchData = async () => {
            try {
                if (parentId) {
                    const data = await getFolderById({ folderId: parentId.toString() });
                    setFolder(data.current);
                    setSubFolders(data.folders);
                } else {
                    const data = await getRootFolder();
                    setFolder(null);
                    setSubFolders(data.folders);
                }
            } catch {
                setSubFolders([]);
            }
        };
        fetchData();
    }, [isOpen, parentId]);

    if (!isOpen) return null;

    const visibleFolders = excludeId ? subFolders.filter(f => f.id !== excludeId) : subFolders;

    async function handleSubmit() {
        try {
            await onMove(selected);
            closeModal();
        } catch {
            setErrorMessage("Une erreur est survenue lors du déplacement.");
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title={title} size="small">
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-txt-secondary dark:text-[#555] uppercase tracking-wider">{itemLabel}</p>
                    <p className="text-sm font-medium text-txt-primary dark:text-[#ededed] truncate">{itemName}</p>
                </div>

                <div className="w-full h-px bg-border-subtle dark:bg-white/[0.06]" />

                <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-txt-secondary dark:text-[#555] uppercase tracking-wider mb-1">Destination</p>
                    <form className="flex flex-col gap-1">
                        {folder?.id != null && (
                            <label key={folder.parent_id} className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] cursor-pointer hover:bg-surface-hover dark:hover:bg-white/[0.04] transition-colors">
                                <input
                                    type="radio"
                                    name="folder"
                                    value={folder.parent_id + ""}
                                    checked={selected === folder.parent_id + ""}
                                    onChange={(e) => setSelected(e.target.value)}
                                    className="accent-[#7c6ef8]"
                                />
                                <span className="text-sm text-txt-primary dark:text-[#ededed]">↑ Dossier parent</span>
                            </label>
                        )}
                        {visibleFolders.map((f) => (
                            <label key={f.id} className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] cursor-pointer hover:bg-surface-hover dark:hover:bg-white/[0.04] transition-colors">
                                <input
                                    type="radio"
                                    name="folder"
                                    value={f.id + ""}
                                    checked={selected === f.id + ""}
                                    onChange={(e) => setSelected(e.target.value)}
                                    className="accent-[#7c6ef8]"
                                />
                                <span className="text-sm text-txt-primary dark:text-[#ededed]">{f.name}</span>
                            </label>
                        ))}
                    </form>
                </div>

                {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
            </div>

            <div className="mt-4 flex justify-end w-full">
                <SubmitButton
                    id="move-button"
                    type="button"
                    text="Mettre à jour"
                    onClick={handleSubmit}
                />
            </div>
        </Modal>
    );
}
