import React, { useState, useEffect } from 'react';
import Modal from "@/src/components/modal/Modal";
import { FileResponse } from "@/src/interface/file";
import { FolderResponse } from '@/src/interface/folder';
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";

import { getFolderById, getRootFolder } from '@/src/api/folders';

import { updateFileMetadata, moveFileIntoFolder} from "@/src/api/file";
import { updateFileValidator } from "@/src/validator/file";


interface MoveFileModalProps {
    isOpen?: boolean;
    fileInfo: FileResponse;
    closeModal: () => void;
}



export default function MoveFileModal({ isOpen, fileInfo, closeModal }: MoveFileModalProps) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [folders, setFolders] = useState<FolderResponse[] | null>([]);
    const [selected, setSelected] = useState< string | null>(null);


    /*useEffect(() => {
        async function fetchFolders() {
            try {
                const data = await getRootFolder();
                setFolders(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchFolders();
    }, []);*/
    
        useEffect(() => {
            const fetchData = async () => {
                setErrorMessage(null);
                try {
                    if(fileInfo.folder_id){
                        const data = await getFolderById({ folderId : fileInfo.folder_id.toString() });
                        setFolders(data.folders);
                    }
                    
                    else{
                        const data = await getRootFolder();
                        setFolders(data);
                    }

                } catch {
                    setFolders(null);
                }
            };
    
            fetchData();
    
        }, [fileInfo?.folder_id]);

    async function handleSubmitMoveFile(fileId:number, folderId: string|null){ 
        //transférer les donnés 
        
        if(folderId){
            moveFileIntoFolder(fileId, folderId);
        }

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

            <div className="flex flex-col">
                <div className="flex items-end gap-2 w-full">
                    <div className="flex-grow">
                        <form className="flex flex-col items-center gap-4 w-full">
                            {
                            
                             folders!=null ? folders.map((folder)=> (
                                <label key={folder.id} className = "flex gap-2">
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
            
            </div>

        </Modal>
    );
}
