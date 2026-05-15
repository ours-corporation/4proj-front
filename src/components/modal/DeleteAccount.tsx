'use client';

import { useState } from 'react';
import Modal from '@/src/components/modal/Modal';
import { deleteAccount } from '@/src/api/user';
import { logout } from '@/src/api/auth';
import { useRouter } from 'next/navigation';

interface DeleteAccountModalProps {
    isOpen: boolean;
    email: string;
    closeModal: () => void;
}

export default function DeleteAccountModal({ isOpen, email, closeModal }: DeleteAccountModalProps) {
    const [confirmation, setConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const isConfirmed = confirmation === email;

    async function handleDelete() {
        if (!isConfirmed) return;
        setLoading(true);
        setError(null);
        try {
            await deleteAccount();
            await logout();
            localStorage.removeItem('accessToken');
            router.push('/login');
        } catch {
            setError('Une erreur est survenue lors de la suppression du compte.');
            setLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="Supprimer le compte" size="small">
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <p className="text-sm text-red-700 dark:text-red-300">
                        Cette action est <span className="font-semibold">irréversible</span>. Tous vos fichiers, dossiers et partages seront définitivement supprimés.
                    </p>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-txt-primary dark:text-dark-txt-primary">
                        Saisissez votre email <span className="font-semibold">{email}</span> pour confirmer :
                    </label>
                    <input
                        type="email"
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        placeholder={email}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-main-bg dark:bg-dark-main-bg text-txt-primary dark:text-dark-txt-primary focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={closeModal}
                        disabled={loading}
                        className="px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 text-txt-primary dark:text-dark-txt-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={!isConfirmed || loading}
                        className="px-4 py-2 text-sm rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Suppression...' : 'Supprimer mon compte'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
