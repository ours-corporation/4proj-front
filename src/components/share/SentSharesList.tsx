'use client';

import { useState, useEffect, useCallback } from 'react';
import { SentShare } from '@/src/interface/share';
import { getSentSharesAPI, deleteShareAPI, updateShareAPI } from '@/src/api/share';
import { useSocketEvent } from '@/src/hooks/useSocketEvent';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

const selectClass = "w-full text-xs rounded-lg border border-border-subtle dark:border-white/[0.08] bg-surface dark:bg-[#0d0d0d] text-txt-primary dark:text-[#ededed] px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#7c6ef8] disabled:opacity-50 cursor-pointer";

function TypeIcon({ type }: { type: 'file' | 'folder' }) {
    return type === 'folder' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500 flex-shrink-0">
            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#555] flex-shrink-0">
            <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6.905 9.97a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V18a.75.75 0 0 0 1.5 0v-4.19l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
            <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
        </svg>
    );
}

export default function SentSharesList() {
    const [shares, setShares] = useState<SentShare[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [passwordInputs, setPasswordInputs] = useState<Record<number, string>>({});
    const [copiedId, setCopiedId] = useState<number | null>(null);

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
        setPendingId(shareId);
        try {
            await deleteShareAPI(shareId);
            setShares(prev => prev.filter(s => s.id !== shareId));
            setExpandedId(null);
        } catch { } finally {
            setPendingId(null);
        }
    }

    async function handleUpdatePermission(shareId: number, permission: 'READ' | 'WRITE') {
        setPendingId(shareId);
        try {
            await updateShareAPI(shareId, permission);
            setShares(prev => prev.map(s => s.id === shareId ? { ...s, permission } : s));
        } catch { } finally { setPendingId(null); }
    }

    async function handleUpdatePassword(shareId: number, password: string | null) {
        setPendingId(shareId);
        try {
            await updateShareAPI(shareId, undefined, password);
            setShares(prev => prev.map(s => s.id === shareId ? { ...s, hasPassword: password !== null } : s));
            setPasswordInputs(prev => ({ ...prev, [shareId]: '' }));
        } catch { } finally { setPendingId(null); }
    }

    async function handleUpdateExpiry(shareId: number, expiresAt: string | null) {
        setPendingId(shareId);
        try {
            await updateShareAPI(shareId, undefined, undefined, expiresAt);
            setShares(prev => prev.map(s => s.id === shareId ? { ...s, expiresAt } : s));
        } catch { } finally { setPendingId(null); }
    }

    function copyLink(token: string, shareId: number) {
        navigator.clipboard.writeText(`${BASE_URL}/share/public/${token}`);
        setCopiedId(shareId);
        setTimeout(() => setCopiedId(null), 2000);
    }

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    const toDateValue = (iso: string | null) => iso ? new Date(iso).toISOString().slice(0, 10) : '';

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <svg className="w-6 h-6 animate-spin text-txt-secondary dark:text-[#444]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
            </div>
        );
    }

    if (shares.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-txt-secondary dark:text-[#444]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 opacity-40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
                <p className="text-sm">Vous n&apos;avez aucun partage actif.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {shares.map(share => {
                const isExpanded = expandedId === share.id;
                const isPending = pendingId === share.id;
                const isPublic = share.shareType === 'public';

                return (
                    <div key={share.id} className="rounded-[12px] border border-border-subtle dark:border-white/[0.06] bg-surface dark:bg-[#111113] overflow-hidden">
                        {/* Header row — cliquable pour expand */}
                        <button
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                            onClick={() => setExpandedId(isExpanded ? null : share.id)}
                        >
                            <TypeIcon type={share.type} />

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium text-txt-primary dark:text-[#ededed] truncate">
                                        {share.item.fullName ?? share.item.name}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isPublic ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'}`}>
                                        {isPublic ? 'Public' : 'Privé'}
                                    </span>
                                    {share.hasPassword && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-txt-secondary dark:text-[#555]" title="Protégé par mot de passe">
                                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                    {!isPublic && share.recipient ? (
                                        <span className="text-xs text-txt-secondary dark:text-[#555]">→ {share.recipient.email} · {share.permission}</span>
                                    ) : (
                                        <span className="text-xs text-txt-secondary dark:text-[#555]">
                                            {share.expiresAt ? `Expire le ${formatDate(share.expiresAt)}` : 'Sans expiration'}
                                        </span>
                                    )}
                                    <span className="text-xs text-txt-secondary dark:text-[#444]">Partagé le {formatDate(share.createdAt)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                {isPublic && share.token && (
                                    <span
                                        role="button"
                                        onClick={e => { e.stopPropagation(); copyLink(share.token!, share.id); }}
                                        className="p-1.5 rounded-[6px] text-txt-secondary dark:text-[#555] hover:text-[#7c6ef8] hover:bg-[#7c6ef8]/10 transition-colors"
                                        title="Copier le lien"
                                    >
                                        {copiedId === share.id ? (
                                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </span>
                                )}
                                <svg className={`w-4 h-4 text-txt-secondary dark:text-[#444] transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        {/* Panel d'édition */}
                        {isExpanded && (
                            <div className="px-4 pb-4 pt-3 border-t border-border-subtle dark:border-white/[0.06] flex flex-col gap-3">
                                <div className="flex flex-wrap gap-3">
                                    {/* Permission (partages privés uniquement) */}
                                    {!isPublic && (
                                        <div className="flex flex-col gap-1 w-40">
                                            <label className="text-xs font-medium text-txt-secondary dark:text-[#555] uppercase tracking-wider">Permission</label>
                                            <select
                                                className={selectClass}
                                                value={share.permission}
                                                disabled={isPending}
                                                onChange={e => handleUpdatePermission(share.id, e.target.value as 'READ' | 'WRITE')}
                                            >
                                                <option value="READ">Lecture</option>
                                                <option value="WRITE">Écriture</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Expiration */}
                                    <div className="flex flex-col gap-1 w-44">
                                        <div className="flex items-center justify-between gap-2">
                                            <label className="text-xs font-medium text-txt-secondary dark:text-[#555] uppercase tracking-wider">Expiration</label>
                                            {share.expiresAt && (
                                                <button
                                                    onClick={() => handleUpdateExpiry(share.id, null)}
                                                    disabled={isPending}
                                                    className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50 transition-colors whitespace-nowrap"
                                                >
                                                    Désactiver
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="date"
                                            className={selectClass}
                                            value={toDateValue(share.expiresAt)}
                                            min={new Date().toISOString().slice(0, 10)}
                                            disabled={isPending}
                                            onChange={e => handleUpdateExpiry(share.id, e.target.value ? new Date(`${e.target.value}T23:59:00`).toISOString() : null)}
                                        />
                                    </div>
                                </div>

                                {/* Mot de passe (partages publics uniquement) */}
                                {isPublic && (
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-txt-secondary dark:text-[#555] uppercase tracking-wider">
                                            Mot de passe {share.hasPassword && <span className="text-emerald-600 dark:text-emerald-400 normal-case">(actif)</span>}
                                        </label>
                                        <div className="flex gap-2 max-w-xs">
                                            <input
                                                type="password"
                                                placeholder={share.hasPassword ? 'Nouveau mot de passe' : 'Ajouter un mot de passe'}
                                                value={passwordInputs[share.id] ?? ''}
                                                disabled={isPending}
                                                onChange={e => setPasswordInputs(prev => ({ ...prev, [share.id]: e.target.value }))}
                                                className="flex-1 text-xs rounded-lg border border-border-subtle dark:border-white/[0.08] bg-surface dark:bg-[#0d0d0d] text-txt-primary dark:text-[#ededed] px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#7c6ef8] disabled:opacity-50"
                                            />
                                            <button
                                                onClick={() => handleUpdatePassword(share.id, passwordInputs[share.id] || null)}
                                                disabled={isPending || !passwordInputs[share.id]}
                                                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#7c6ef8] text-white disabled:opacity-40 transition-opacity"
                                            >
                                                OK
                                            </button>
                                            {share.hasPassword && (
                                                <button
                                                    onClick={() => handleUpdatePassword(share.id, null)}
                                                    disabled={isPending}
                                                    title="Supprimer le mot de passe"
                                                    className="px-2 py-1.5 rounded-lg text-xs text-red-500 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Révoquer */}
                                <button
                                    onClick={() => handleRevoke(share.id)}
                                    disabled={isPending}
                                    className="flex items-center justify-center gap-2 w-fit px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                >
                                    {isPending ? (
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    )}
                                    Révoquer ce partage
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
