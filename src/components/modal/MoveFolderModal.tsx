import React, { useState, useEffect } from 'react';
import Modal from "@/src/components/modal/Modal";
import { FolderResponse } from "@/src/interface/folder";
import InputField from "@/src/components/input/InputField";
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

            <div className = "bg-main-bg dark:bg-dark-surface rounded-xl p-4 border border-border-subtle dark:border-dark-border-subtle">
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col gap-1">
                            <p className="text-txt-primary dark:text-dark-txt-primary mb-1">
                                Dossier
                            </p>
                            <p className="font-medium text-txt-secondary dark:text-dark-txt-secondary truncate">
                                {folderName}
                            </p>
                        </div>
                        <div className="w-full h-px bg-border-subtle dark:bg-dark-border-subtle"></div>
                        
                        <form className="flex flex-col gap-4 w-full">
                            <label className="text-txt-primary dark:text-dark-txt-primary mb-1">
                                Destination
                            </label>
                            {
                            folder?.id!=null ?
                            <label key={folder.parent_id} className = "flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="folder"
                                        value={folder.parent_id+""}
                                        checked={selected === folder.parent_id+""}
                                        onChange={(e) => setSelected(e.target.value)}
                                    />
                                    Remonter au dossier parent
                                </label> : null
                            }
                            {
                            subFolders!=null ? subFolders
                            .filter((folder) => folder.id !== folderInfo.id) //vérifie de ne pas afficher le folder lui même
                            .map((folder)=> (
                                
                                <label key={folder.id} className = "flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="folder"
                                        value={folder.id+""}
                                        checked={selected === folder.id+""}
                                        onChange={(e) => setSelected(e.target.value)}
                                    />
                                    {folder.name}
                                </label>
                            )) : null
                            }
                        </form>
                    </div>
                </div>
                <p className="mt-2">
                    {errorMessage && (
                        <span className="text-sm text-red-500">{errorMessage}</span>
                    )}
                </p>
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