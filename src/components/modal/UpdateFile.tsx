import React, { useState, useEffect } from 'react';
import Modal from "@/src/components/modal/Modal";
import { FileResponse } from "@/src/interface/file";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";
import { updateFileMetadata } from "@/src/api/file";
import { updateFileValidator } from "@/src/validator/file";

interface UpdateFileModalProps {
    isOpen?: boolean;
    fileInfo: FileResponse;
    closeModal: () => void;
}

export default function UpdateFileModal({ isOpen, fileInfo, closeModal }: UpdateFileModalProps) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [fileExtension, setFileExtension] = useState<string>("");

    useEffect(() => {
        if (fileInfo?.name) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFileName(fileInfo.name);
            setFileExtension('.' + fileInfo.extension);
        }
    }, [fileInfo]);

    async function updateFileInfo() {
        const resultat = updateFileValidator.safeParse({
            name: fileName,
        });
        if (!resultat.success) {
            console.log("Validation échouée:", resultat.error);
            setErrorMessage("Nom de fichier invalide.");
            return;
        }


        const fullFileName = fileName + fileExtension;

        updateFileMetadata(fileInfo.id, fullFileName)
            .then((updatedFile) => {
                console.log("Fichier mis à jour avec succès:", updatedFile);
                closeModal(); // Déplacé ici pour fermer seulement si succès (optionnel mais recommandé)
            })
            .catch((error) => {
                console.error("Erreur lors de la mise à jour du fichier:", error);
            });
    }

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title="Mettre à jour le fichier"
            size="small"
        >
            <div className="flex flex-col">
                <div className="flex items-end gap-2 w-full">
                    <div className="flex-grow">
                        <InputField
                            id="file-name"
                            label="Nom du fichier"
                            value={fileName}
                            type="text"
                            onChange={setFileName}
                            extension={fileExtension}
                        />
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
                            updateFileInfo();
                        }}
                    />
                </div>

            </div>
        </Modal>
    );
}