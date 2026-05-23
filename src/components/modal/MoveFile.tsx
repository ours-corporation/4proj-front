import React, { useState, useEffect } from 'react';
import Modal from "@/src/components/modal/Modal";
import { FileResponse } from "@/src/interface/file";
import { FolderResponse } from '@/src/interface/folder';
import SubmitButton from "@/src/components/button/SubmitButton";

import { getFolderById, getRootFolder } from '@/src/api/folders';

import {moveFileIntoFolder} from "@/src/api/file";



interface MoveFileModalProps {
    isOpen?: boolean;
    fileInfo: FileResponse;
    closeModal: () => void;
}



export default function MoveFileModal({ isOpen, fileInfo, closeModal }: MoveFileModalProps) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [subFolders, setSubFolders] = useState<FolderResponse[] | null>([]);
    const [selected, setSelected] = useState< string | null>(null);
    const [folder, setFolder] = useState<FolderResponse | null>();
    
        useEffect(() => {
            const fetchData = async () => {
                setErrorMessage(null);
                try {
                    if(fileInfo.folder_id){
                        const data = await getFolderById({ folderId : fileInfo.folder_id.toString() });
                        setFolder(data.current);
                        setSubFolders(data.folders);
                    }
                    
                    else{
                        const data = await getRootFolder();
                        setFolder(null);
                        setSubFolders(data.folders);
                    }

                } catch {
                    setSubFolders(null);
                }
            };
    
            fetchData();
    
        }, [fileInfo?.folder_id]);

    async function handleSubmitMoveFile(fileId:number, folderId: string|null){ 
        //transférer les donnés 
    
        moveFileIntoFolder(fileId, folderId);
    
        closeModal();
    }

    if(!isOpen) return null



    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title="Déplacer le fichier"
            size="small"
        >
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-txt-secondary dark:text-[#555] uppercase tracking-wider">Fichier</p>
                    <p className="text-sm font-medium text-txt-primary dark:text-[#ededed] truncate">
                        {fileInfo.name + "." + fileInfo.extension}
                    </p>
                </div>

                <div className="w-full h-px bg-border-subtle dark:bg-white/[0.06]" />

                <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-txt-secondary dark:text-[#555] uppercase tracking-wider mb-1">Destination</p>
                    <form className="flex flex-col gap-1">
                        {folder != null && (
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
                        {subFolders != null && subFolders.map((f) => (
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
                        handleSubmitMoveFile(fileInfo.id, selected);
                    }}
                />
            </div>
            
            

        </Modal>
    );
}
