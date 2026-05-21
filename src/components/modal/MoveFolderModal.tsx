import React, { useState, useEffect } from 'react';
import Modal from "@/src/components/modal/Modal";
import { FolderResponse } from "@/src/interface/folder";
import SubmitButton from "@/src/components/button/SubmitButton";
import{moveFolderIntoFolder, getFolderById, getRootFolder} from "@/src/api/folders"

interface MoveFolderModalProps {
    isOpen?: boolean;
    folderInfo: FolderResponse;
    closeModal: () => void;
    onSuccess?: () => void;
}

export default function MoveFolderModal({ isOpen, folderInfo, closeModal, onSuccess }: MoveFolderModalProps) {
    const [folderName, setFolderName] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [folder, setFolder] = useState<FolderResponse | null>(null);
    const [subFolders, setSubFolders] = useState<FolderResponse[]>([]);
    const [selected, setSelected] = useState< string | null>(null);

    useEffect(() => {
            if (folderInfo?.name) {
                setFolderName(folderInfo.name);
            }

            const fetchData = async () => {
                setErrorMessage(null);
                try {
                    if(folderInfo.parent_id){
                        const data = await getFolderById({ folderId : folderInfo.parent_id.toString()});
                        setFolder(data.current);
                        setSubFolders(data.folders);
                    }
                    
                    else{
                        const data = await getRootFolder();
                        setFolder(null);
                        setSubFolders(data.folders);
                    }

                } catch {
                    setSubFolders([]);
                }
            };
    
            fetchData();
    }, [folderInfo]);

    async function handleSubmitMoveFolder (movingFolderId:number|null, destinationFolderId: string|null){

        try {
            await moveFolderIntoFolder(movingFolderId, destinationFolderId);
            closeModal();
            onSuccess?.();

        } catch {
            setErrorMessage("Une erreur est survenue lors du renommage.");
        }
    }


    if (!isOpen) return null;

    return (
         <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title="Déplacer le dossier"
            size="small">

            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-txt-secondary dark:text-[#555] uppercase tracking-wider">Dossier</p>
                    <p className="text-sm font-medium text-txt-primary dark:text-[#ededed] truncate">{folderName}</p>
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
                        {subFolders != null && subFolders
                            .filter((f) => f.id !== folderInfo.id)
                            .map((f) => (
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
                            ))
                        }
                    </form>
                </div>

                {errorMessage && (
                    <p className="text-sm text-red-500">{errorMessage}</p>
                )}
            </div>

            <div className="mt-4 flex justify-end w-full">
                <SubmitButton
                    id="update-file-button"
                    type="button"
                    text="Mettre à jour"
                    onClick={() => {
                        handleSubmitMoveFolder(folderInfo.id, selected);
                    }}
                />
            </div>

        </Modal>

    );
}