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

type ExpirationPreset = 'none' | '1d' | '7d' | '30d' | 'custom';

const PRESETS: { value: ExpirationPreset; label: string }[] = [
    { value: 'none', label: 'Sans expiration' },
    { value: '1d',   label: '1 jour' },
    { value: '7d',   label: '7 jours' },
    { value: '30d',  label: '30 jours' },
    { value: 'custom', label: 'Personnalisée' },
];

function resolveExpiresAt(preset: ExpirationPreset, customDate: string): string | undefined {
    if (preset === 'none') return undefined;
    if (preset === 'custom') {
        if (!customDate) return undefined;
        return new Date(`${customDate}T23:59:00`).toISOString();
    }
    const days = preset === '1d' ? 1 : preset === '7d' ? 7 : 30;
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(23, 59, 0, 0);
    return d.toISOString();
}

export default function PublicShare({ fileInfo, folderInfo }: PublicShareProps) {
    const [passwordProtected, setPasswordProtected] = useState(false);
    const [password, setPassword] = useState('');
    const [preset, setPreset] = useState<ExpirationPreset>('none');
    const [customDate, setCustomDate] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [shareLink, setShareLink] = useState<string | null>(null);

    async function createPublicShareLink() {
        setErrorMessage('');
        const fileId = fileInfo ? fileInfo.id : null;
        const folderId = folderInfo ? folderInfo.id : null;
        if (!fileId && !folderId) {
            setErrorMessage('Aucun fichier ou dossier sélectionné pour le share.');
            return;
        }

        if (preset === 'custom' && !customDate) {
            setErrorMessage('Veuillez sélectionner une date d\'expiration.');
            return;
        }

        const expiresAt = resolveExpiresAt(preset, customDate);

        const validatorResult = createPublicShareLinkValidator.safeParse({
            password: passwordProtected ? password : undefined,
            expiresAt,
        });

        if (!validatorResult.success) {
            setErrorMessage(validatorResult.error.issues[0].message);
            return;
        }

        const rep = await createPublicShareAPI(
            fileId ?? undefined,
            folderId ?? undefined,
            passwordProtected ? password : undefined,
            expiresAt,
        );

        if (rep.ok) {
            try {
                const data = await rep.json() as CreatePublicShareResponse;
                setShareLink(`${window.location.origin}/share/public/${data.token}`);
            } catch {
                setErrorMessage('Erreur lors de la création du lien de share.');
            }
        } else {
            const errorData = await rep.json();
            setErrorMessage(errorData.error || 'Une erreur est survenue lors de la création du lien de share.');
        }
    }

    const today = new Date().toISOString().split('T')[0];

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
                    <h2 className="text-lg font-bold mb-4 text-txt-primary dark:text-dark-txt-primary">Partager le fichier publiquement</h2>

                    <div className="mt-4 flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-txt-primary dark:text-dark-txt-primary">
                            Activer la protection par mot de passe
                        </span>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={passwordProtected}
                            onClick={() => setPasswordProtected(!passwordProtected)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-action focus:ring-offset-2 ${passwordProtected ? 'bg-action dark:bg-dark-action' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            <span className="sr-only">Activer la protection par mot de passe</span>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${passwordProtected ? 'translate-x-6' : 'translate-x-1'}`} />
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

                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-txt-primary dark:text-dark-txt-primary">
                                Expiration du lien
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {PRESETS.map((p) => (
                                    <button
                                        key={p.value}
                                        type="button"
                                        onClick={() => setPreset(p.value)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                                            preset === p.value
                                                ? 'bg-action dark:bg-dark-action text-white border-action dark:border-dark-action'
                                                : 'bg-transparent text-txt-secondary dark:text-dark-txt-secondary border-border-subtle dark:border-dark-border-subtle hover:border-action dark:hover:border-dark-action'
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                            {preset === 'custom' && (
                                <input
                                    type="date"
                                    min={today}
                                    value={customDate}
                                    onChange={(e) => setCustomDate(e.target.value)}
                                    className="mt-1 w-full bg-transparent border border-border-subtle dark:border-dark-border-subtle rounded-lg px-3 py-2 text-sm text-txt-primary dark:text-dark-txt-primary focus:outline-none focus:border-action dark:focus:border-dark-action"
                                />
                            )}
                        </div>

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