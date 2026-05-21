import React, { useState } from 'react';
import { FileResponse } from "@/src/interface/file";
import { FolderResponse } from "@/src/interface/folder";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";
import { createPrivateShareAPI } from "@/src/api/share";
import { createPrivateShareValidator } from "@/src/validator/share";

interface PrivateShareProps {
    fileInfo?: FileResponse;
    folderInfo?: FolderResponse;
}

export default function PrivateShare({ fileInfo, folderInfo }: PrivateShareProps) {
    const [ email, setEmail ] = useState('');

    const [ successMessage, setSuccessMessage ] =  useState("");
    const [ errorMessage, setErrorMessage ] =  useState("");

    const [canEdit, setCanEdit] = useState(false);

    async function createPrivateShare() {
        setSuccessMessage("");
        setErrorMessage("");
        const fileId = fileInfo ? fileInfo.id : null;
        const folderId = folderInfo ? folderInfo.id : null;
        if (!fileId && !folderId) {
            setErrorMessage("Aucun fichier ou dossier sélectionné pour le share.");
            return;
        }

        const validatorResult = createPrivateShareValidator.safeParse({
            email: email,
            permission: canEdit ? 'WRITE' : 'READ'
        });
        if (!validatorResult.success) {
            const firstError = validatorResult.error.issues[0];
            setErrorMessage(firstError.message);
            return;
        }

        const rep = await createPrivateShareAPI(
            fileId ?? undefined,
            folderId ?? undefined,
            email,
            canEdit ? 'WRITE' : 'READ');

        if (rep.ok) {
            setSuccessMessage("Le share a été créé avec succès.");
            setErrorMessage("");
            setCanEdit(false);
            setEmail('');
        } else {
            if (rep.status === 400) {
                const data = await rep.json();
                setErrorMessage(data.message || "Une erreur est survenue lors de la création du share.");
            } else {
                setErrorMessage("Une erreur est survenue lors de la création du share.");
            }
        }
    }

    return (
        <div>
            <h2 className="text-lg font-bold mb-4 text-txt-primary dark:text-dark-txt-primary">Partager à un utilisateur</h2>
            <p className="text-sm text-txt-secondary dark:text-dark-txt-secondary mb-6">
                Entrez l&apos;email de l&apos;utilisateur avec lequel vous souhaitez partager ce fichier ou dossier.
            </p>
            <div className="flex flex-col gap-4">
                <InputField
                    id="email"
                    label="Email de l'utilisateur"
                    type="email"
                    value={email}
                    onChange={setEmail}
                />

                <div className="flex items-center justify-between p-3 bg-main-bg dark:bg-dark-main-bg rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Autoriser la modification
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {canEdit ? "L'utilisateur pourra modifier le contenu." : "L'utilisateur pourra uniquement voir le contenu."}
                        </span>
                    </div>

                    <button
                        type="button"
                        role="switch"
                        aria-checked={canEdit}
                        onClick={() => setCanEdit(!canEdit)}
                        className={`
                            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                            ${canEdit ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}
                        `}
                    >
                        <span className="sr-only">Utiliser le paramètre de modification</span>
                        <span
                            aria-hidden="true"
                            className={`
                                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                                ${canEdit ? 'translate-x-5' : 'translate-x-0'}
                            `}
                        />
                    </button>
                </div>


                {errorMessage && (
                    <p className="text-sm text-error dark:text-dark-error">{errorMessage}</p>
                )}

                {successMessage && (
                    <p className="text-sm text-success dark:text-dark-success">{successMessage}</p>
                )}

                <SubmitButton
                    id="add-permission-button"
                    type="button"
                    text="Partager à cet utilisateur"
                    onClick={() => { createPrivateShare(); }}
                />
            </div>
        </div>
    );
}