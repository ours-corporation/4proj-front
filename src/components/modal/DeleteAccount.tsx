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
                <div className="flex items-start gap-3 p-4 rounded-[12px] bg-[#ef5350]/[0.06] border border-[#ef5350]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ef5350" className="w-5 h-5 shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <p className="text-[13px] text-[#ef5350]/80 leading-relaxed">
                        Cette action est <span className="font-semibold text-[#ef5350]">irréversible</span>. Tous vos fichiers, dossiers et partages seront définitivement supprimés.
                    </p>
                </div>

                <div>
                    <label className="block text-[11px] font-medium text-[#555] mb-1.5 uppercase tracking-wider">
                        Confirmez en saisissant votre e-mail
                    </label>
                    <div className="w-full bg-[#0d0d0d] border border-white/[0.08] rounded-[10px] px-4 py-3 flex items-center transition-all focus-within:border-[#ef5350]/40">
                        <input
                            type="email"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                            placeholder={email}
                            className="flex-grow bg-transparent focus:outline-none p-0 border-none ring-0 text-[#ededed] text-sm placeholder:text-[#333]"
                        />
                    </div>
                </div>

                {error && <p className="text-[13px] text-[#ef5350] px-3 py-2 bg-[#ef5350]/[0.08] border border-[#ef5350]/20 rounded-[8px]">{error}</p>}

                <div className="flex gap-3 pt-1">
                    <button
                        onClick={closeModal}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 text-sm rounded-[10px] border border-white/[0.08] text-[#888] hover:text-[#ededed] hover:border-white/[0.15] transition-all disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={!isConfirmed || loading}
                        className="flex-1 px-4 py-2.5 text-sm font-medium rounded-[10px] bg-[#ef5350] text-white hover:bg-[#d32f2f] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Suppression…' : 'Supprimer mon compte'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
