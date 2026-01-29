import React, { useState } from 'react';
import { FileResponse } from "@/src/interface/file";
import { FolderResponse } from "@/src/interface/folder";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";
import {createPublicShareLinkValidator} from "@/src/validator/share";
import {createPublicShareAPI} from "@/src/api/share";

interface PublicShareProps {
    fileInfo?: FileResponse;
    folderInfo?: FolderResponse;
}

interface CreatePublicShareResponse {
    link: string;
    token: string;
    expiresAt?: string;
}

export default function PublicShare({ fileInfo, folderInfo }: PublicShareProps) {

    const [ passwordProtected, setPasswordProtected ] = useState(false);
    const [ password, setPassword ] = useState('');
    const [ expirationDate, setExpirationDate ] = useState('');

    const [ errorMessage, setErrorMessage ] =  useState("");
    const [ shareLink, setShareLink ] = useState<string | null>(null);

    async function createPublicShareLink() {
        setErrorMessage("");
        const fileId = fileInfo ? fileInfo.id : null;
        const folderId = folderInfo ? folderInfo.id : null;
        if (!fileId && !folderId) {
            setErrorMessage("Aucun fichier ou dossier sélectionné pour le share.");
            return;
        }

        const validatorResult = createPublicShareLinkValidator.safeParse({
            password: passwordProtected ? password : undefined,
            expiresAt: expirationDate ? new Date(expirationDate).toISOString() : undefined
        });

        if (!validatorResult.success) {
            const firstError = validatorResult.error.issues[0];
            setErrorMessage(firstError.message);
            return;
        }

        const rep = await createPublicShareAPI(fileId ?? undefined, folderId ?? undefined,
            passwordProtected ? password : undefined,
            expirationDate ? new Date(expirationDate).toISOString() : undefined);

        if (rep.ok) {
            try {
                const data = await rep.json() as CreatePublicShareResponse;
                const token = data.token;
                const link = `${window.location.origin}/share/public/${token}`;
                setShareLink(link);
                setErrorMessage("");
            } catch (e) {
                setErrorMessage("Erreur lors de la création du lien de share.");
            }
        } else {
            const errorData = await rep.json();
            setErrorMessage(errorData.error || "Une erreur est survenue lors de la création du lien de share.");
        }
    }

    return (
        <div>
            {shareLink ? (
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold mb-4">Lien de partage généré</h2>
                    <InputField
                        id="share-link"
                        label="Lien de partage"
                        type="text"
                        value={shareLink}
                        onChange={() => {}}
                    />
                    <p className="text-sm text-txt-secondary dark:text-dark-txt-secondary">
                        Partagez ce lien avec les personnes souhaitées. N&apos;oubliez pas que si vous avez activé la protection par mot de passe, elles devront le connaître pour accéder au contenu.
                    </p>
                </div>
            ) : (
                <div>
                    <h2 className="text-lg font-bold mb-4">Partager le fichier publiquement</h2>
                    <div className="mt-4 flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-txt-primary dark:text-dark-txt-primary">
                            Activer la protection par mot de passe
                        </span>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={passwordProtected}
                            onClick={() => setPasswordProtected(!passwordProtected)}
                            className={`
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-action focus:ring-offset-2
                                ${passwordProtected ? 'bg-action dark:bg-dark-action' : 'bg-gray-200 dark:bg-gray-700'}
                            `}
                        >
                            <span className="sr-only">Activer la protection par mot de passe</span>
                            <span
                                className={`
                                    inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out
                                    ${passwordProtected ? 'translate-x-6' : 'translate-x-1'}
                                `}
                            />
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <InputField
                            id="password"
                            label="Mot de passe"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            disabled={!passwordProtected}
                        />

                        <InputField
                            id="expiration-date"
                            label="Date d'expiration du lien"
                            value={expirationDate}
                            type="datetime-local"
                            onChange={setExpirationDate}
                        />

                        {errorMessage && (
                            <p className="text-sm text-error dark:text-dark-error">{errorMessage}</p>
                        )}

                        <SubmitButton
                            id="generate-link"
                            type="button"
                            text="Générer le lien de partage"
                            onClick={() => { createPublicShareLink(); }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}