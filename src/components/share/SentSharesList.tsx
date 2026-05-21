'use client';

import { useState, useEffect, useCallback } from 'react';
import { SentShare } from '@/src/interface/share';
import { getSentSharesAPI, deleteShareAPI } from '@/src/api/share';
import { useSocketEvent } from '@/src/hooks/useSocketEvent';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

function ShareBadge({ shareType }: { shareType: 'public' | 'private' }) {
    return shareType === 'public' ? (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            Public
        </span>
    ) : (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
            Privé
        </span>
    );
}

function TypeIcon({ type }: { type: 'file' | 'folder' }) {
    return type === 'folder' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400 dark:text-gray-500">
            <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6.905 9.97a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V18a.75.75 0 0 0 1.5 0v-4.19l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
            <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
        </svg>
    );
}

export default function SentSharesList() {
    const [shares, setShares] = useState<SentShare[]>([]);
    const [loading, setLoading] = useState(true);
    const [revoking, setRevoking] = useState<number | null>(null);

    const fetchShares = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getSentSharesAPI();
            setShares(data);
        } catch {
            setShares([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchShares(); }, [fetchShares]);

    useSocketEvent('share:created', useCallback(() => { fetchShares(); }, [fetchShares]));
    useSocketEvent('share:updated', useCallback(() => { fetchShares(); }, [fetchShares]));
    useSocketEvent('share:revoked', useCallback(() => { fetchShares(); }, [fetchShares]));

    async function handleRevoke(shareId: number) {
        setRevoking(shareId);
        try {
            await deleteShareAPI(shareId);
            setShares(prev => prev.filter(s => s.id !== shareId));
        } catch {
        } finally {
            setRevoking(null);
        }
    }

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric',
        });
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <svg className="w-6 h-6 animate-spin text-txt-secondary dark:text-dark-txt-secondary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
            </div>
        );
    }

    if (shares.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-txt-secondary dark:text-dark-txt-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 opacity-40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
                <p className="text-sm">Vous n&apos;avez aucun partage actif.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            {shares.map(share => (
                <div key={share.id} className="flex items-center gap-4 py-4 px-2">
                    <TypeIcon type={share.type} />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-txt-primary dark:text-dark-txt-primary truncate">
                                {share.item.fullName ?? share.item.name}
                            </span>
                            <ShareBadge shareType={share.shareType} />
                            {share.hasPassword && (
                                <span title="Protégé par mot de passe">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-txt-secondary dark:text-dark-txt-secondary">
                                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            {share.shareType === 'private' && share.recipient ? (
                                <span className="text-xs text-txt-secondary dark:text-dark-txt-secondary">
                                    → {share.recipient.email} · {share.permission}
                                </span>
                            ) : share.token ? (
                                <button
                                    onClick={() => navigator.clipboard.writeText(`${BASE_URL}/share/public/${share.token}`)}
                                    className="text-xs text-action dark:text-dark-action hover:underline"
                                    title="Copier le lien"
                                >
                                    Copier le lien
                                </button>
                            ) : null}
                            {share.expiresAt && (
                                <span className="text-xs text-txt-secondary dark:text-dark-txt-secondary">
                                    Expire le {formatDate(share.expiresAt)}
                                </span>
                            )}
                            <span className="text-xs text-txt-secondary dark:text-dark-txt-secondary">
                                Partagé le {formatDate(share.createdAt)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => handleRevoke(share.id)}
                        disabled={revoking === share.id}
                        className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                    >
                        {revoking === share.id ? 'Révocation...' : 'Révoquer'}
                    </button>
                </div>
            ))}
        </div>
    );
}
