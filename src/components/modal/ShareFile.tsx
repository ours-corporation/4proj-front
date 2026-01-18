import React, { useState } from 'react';
import Modal from "@/src/components/modal/Modal";
import { FileResponse } from "@/src/interface/file";
import { FolderResponse } from "@/src/interface/folder";
import InputField from "@/src/components/input/InputField";
import SubmitButton from "@/src/components/button/SubmitButton";
import {createPublicShareLinkValidator} from "@/src/validator/share";
import {createPublicShare} from "@/src/api/share";

interface ShareFileModalProps {
    isOpen?: boolean;
    fileInfo?: FileResponse;
    folderInfo?: FolderResponse;
    closeModal: () => void;
}

export default function ShareFileModal({ isOpen, fileInfo, folderInfo, closeModal }: ShareFileModalProps) {
    const [visibility, setVisibility] = useState<'public' | 'internal'>('public');

    if (!fileInfo && !folderInfo) return null;

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title="Partager le fichier"
            size="small"
        >
            <div className="flex flex-col gap-4 py-4">
                {/* Switch de sélection */}
                <div className="flex bg-main-bg dark:bg-dark-main-bg p-1 rounded-lg select-none">
                    <button
                        onClick={() => setVisibility('public')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                            visibility === 'public'
                                ? 'bg-surface dark:bg-dark-surface text-action dark:text-dark-action shadow-sm'
                                : 'text-txt-secondary dark:text-dark-txt-secondary hover:text-action dark:hover:text-dark-action'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        Partage Public
                    </button>

                    <button
                        onClick={() => setVisibility('internal')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                            visibility === 'internal'
                                ? 'bg-surface dark:bg-dark-surface text-action dark:text-dark-action shadow-sm'
                                : 'text-txt-secondary dark:text-dark-txt-secondary hover:text-action dark:hover:text-dark-action'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        Partage Utilisateurs
                    </button>
                </div>

                {visibility === 'public' ? (
                    <>
                        <PublicShare
                            fileInfo={fileInfo}
                            folderInfo={folderInfo}
                        />
                    </>
                ) : (
                    <p className="text-sm text-gray-500 text-center mt-2">Le fichier sera accessible uniquement aux membres.</p>
                )}

            </div>
        </Modal>
    );
}


interface PublicShareProps {
    fileInfo?: FileResponse;
    folderInfo?: FolderResponse;
}

interface CreatePublicShareResponse {
    link: string;
    token: string;
    expiresAt?: string;
}

function PublicShare({ fileInfo, folderInfo }: PublicShareProps) {

    const [ passwordProtected, setPasswordProtected ] = useState(false);
    const [ password, setPassword ] = useState('');
    const [ expirationDate, setExpirationDate ] = useState('');

    const [ errorMessage, setErrorMessage ] =  useState("");
    const [ shareLink, setShareLink ] = useState<string | null>(null);

    async function createPublicShareLink() {
        const fileId = fileInfo ? fileInfo.id : null;
        const folderId = folderInfo ? folderInfo.id : null;
        if (!fileId && !folderId) {
            setErrorMessage("Aucun fichier ou dossier sélectionné pour le partage.");
            return;
        }

        setErrorMessage("");

        // Supposons que createPublicShareLinkValidator est importé
        const validatorResult = createPublicShareLinkValidator.safeParse({
            password: passwordProtected ? password : undefined,
            expiresAt: expirationDate ? new Date(expirationDate).toISOString() : undefined
        });

        if (!validatorResult.success) {
            const firstError = validatorResult.error.issues[0];
            setErrorMessage(firstError.message);
            return; // <-- AJOUT IMPORTANT : Arrêter l'exécution si la validation échoue
        }

        const rep = await createPublicShare(fileId ?? undefined, folderId ?? undefined,
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
                setErrorMessage("Erreur lors de la création du lien de partage.");
            }
        } else {
            const errorData = await rep.json();
            setErrorMessage(errorData.error || "Une erreur est survenue lors de la création du lien de partage.");
        }
    }

    return (
        <div>
            {shareLink ? (
                <div className="p-4 bg-green-100 dark:bg-green-900 rounded-md">
                    <h3 className="text-md font-medium mb-2">Lien de partage généré :</h3>
                    <a
                        href={shareLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-action dark:text-dark-action break-all"
                    >
                        {shareLink}
                    </a>
                </div>
            ) : (
                /* CORRECTION SYNTAXE : Ajout du Fragment (<>) pour englober les éléments frères */
                <>
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
                </>
            )}
        </div>
    );
}