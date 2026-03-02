import React, { useState, useEffect } from 'react';
import Modal from "@/src/components/modal/Modal";
import { FileResponse } from "@/src/interface/file";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";
import { updateFileMetadata } from "@/src/api/file";
import { updateFileValidator } from "@/src/validator/file";

interface MoveFileModalProps {
    isOpen?: boolean;
    fileInfo: FileResponse;
    closeModal: () => void;
}

export default function MoveFileModal({ isOpen, fileInfo, closeModal }: MoveFileModalProps) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");

    async function moveFile(){
        console.log("ok");
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
                                Voici un affichage rudimentaire
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
                                    moveFile();
                                }}
                            />
                        </div>
        
                    </div>

        </Modal>
    );
}
