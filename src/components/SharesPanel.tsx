import React, { useState } from 'react';
import { FileShareItem } from '@/src/interface/share';
import { updateShareAPI, deleteShareAPI } from '@/src/api/share';

interface SharesPanelProps {
    shares: FileShareItem[];
    setShares: React.Dispatch<React.SetStateAction<FileShareItem[]>>;
    sharesLoading: boolean;
    sharesError: boolean;
}

export default function SharesPanel({ shares, setShares, sharesLoading, sharesError }: SharesPanelProps) {
    const [pendingShareId, setPendingShareId] = useState<number | null>(null);
    const [expandedShareId, setExpandedShareId] = useState<number | null>(null);
    const [passwordInputs, setPasswordInputs] = useState<Record<number, string>>({});
    const [copiedShareId, setCopiedShareId] = useState<number | null>(null);
    const [dateInputs, setDateInputs] = useState<Record<number, string>>({});

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });

    if (sharesLoading) {
        return (
            <div className="flex items-center justify-center py-10 gap-3 text-gray-400">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span className="text-sm">Chargement des partages...</span>
            </div>
        );
    }

    if (sharesError) {
        return <p className="text-sm text-red-500 text-center py-6">Impossible de charger les partages.</p>;
    }

    if (shares.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-txt-secondary dark:text-dark-txt-secondary">
                <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <p className="text-sm">Aucun partage.</p>
            </div>
        );
    }

    const publicShares = shares.filter(s => s.shareType === 'public');
    const privateShares = shares.filter(s => s.shareType === 'private');

    async function handleDelete(shareId: number) {
        setPendingShareId(shareId);
        try {
            await deleteShareAPI(shareId);
            setShares(prev => prev.filter(s => s.id !== shareId));
            setExpandedShareId(null);
        } catch { /* silent */ }
        finally { setPendingShareId(null); }
    }

    async function handleUpdatePermission(shareId: number, permission: 'READ' | 'WRITE') {
        setPendingShareId(shareId);
        try {
            await updateShareAPI(shareId, permission);
            setShares(prev => prev.map(s => s.id === shareId ? { ...s, permission } : s));
        } catch { /* silent */ }
        finally { setPendingShareId(null); }
    }

    async function handleUpdatePassword(shareId: number, password: string | null) {
        setPendingShareId(shareId);
        try {
            await updateShareAPI(shareId, undefined, password);
            setShares(prev => prev.map(s => s.id === shareId ? { ...s, hasPassword: password !== null } : s));
            setPasswordInputs(prev => ({ ...prev, [shareId]: '' }));
        } catch { /* silent */ }
        finally { setPendingShareId(null); }
    }

    async function handleUpdateExpiry(shareId: number, expiresAt: string | null) {
        setPendingShareId(shareId);
        try {
            await updateShareAPI(shareId, undefined, undefined, expiresAt);
            setShares(prev => prev.map(s => s.id === shareId ? { ...s, expiresAt } : s));
        } catch { /* silent */ }
        finally { setPendingShareId(null); }
    }

    const selectClass = "w-full text-xs rounded-lg border border-border-subtle dark:border-dark-border-subtle bg-surface dark:bg-dark-main-bg text-txt-primary dark:text-dark-txt-primary px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-action dark:focus:ring-dark-action disabled:opacity-50 cursor-pointer";

    const toDateInputValue = (iso: string | null) =>
        iso ? new Date(iso).toISOString().slice(0, 10) : '';

    const renderSharePanel = (share: FileShareItem, isPublic: boolean) => {
        const isExpanded = expandedShareId === share.id;
        const isPending = pendingShareId === share.id;
        const bg = isPublic ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-purple-50 dark:bg-purple-900/10';
        const border = isPublic
            ? (isExpanded ? 'border-blue-200 dark:border-blue-800' : 'border-blue-100 dark:border-blue-900/30')
            : (isExpanded ? 'border-purple-200 dark:border-purple-800' : 'border-purple-100 dark:border-purple-900/30');
        const divider = isPublic ? 'border-blue-100 dark:border-blue-900/30' : 'border-purple-100 dark:border-purple-900/30';

        return (
            <div key={share.id} className={`rounded-xl border overflow-hidden transition-all ${bg} ${border}`}>
                <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
                    onClick={() => setExpandedShareId(isExpanded ? null : share.id)}
                >
                    {!isPublic && share.recipient ? (
                        <>
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
                                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase">
                                    {share.recipient.username.charAt(0)}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-txt-primary dark:text-dark-txt-primary truncate">{share.recipient.username}</p>
                                <p className="text-xs text-txt-secondary dark:text-dark-txt-secondary truncate">{share.recipient.email}</p>
                            </div>
                        </>
                    ) : (
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-txt-primary dark:text-dark-txt-primary">Lien public</p>
                            <p className="text-xs text-txt-secondary dark:text-dark-txt-secondary">
                                {share.expiresAt ? `Expire le ${formatDate(share.expiresAt)}` : 'Sans expiration'}
                            </p>
                        </div>
                    )}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {isPublic && share.hasPassword && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Protégé
                            </span>
                        )}
                        <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                share.permission === 'WRITE'
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${share.permission === 'WRITE' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                {share.permission === 'WRITE' ? 'Écriture' : 'Lecture'}
                            </span>
                            {isPublic && (
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(`${window.location.origin}/share/public/${share.token}`);
                                        setCopiedShareId(share.id);
                                        setTimeout(() => setCopiedShareId(null), 2000);
                                    }}
                                    title="Copier le lien"
                                    className="p-1 rounded-md text-txt-secondary dark:text-dark-txt-secondary hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                >
                                    {copiedShareId === share.id ? (
                                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            )}
                            <svg className={`w-3.5 h-3.5 text-txt-secondary dark:text-dark-txt-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </button>

                {isExpanded && (
                    <div className={`px-3 pb-3 pt-2 border-t ${divider} flex flex-col gap-2`}>
                        {!isPublic && (
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-txt-secondary dark:text-dark-txt-secondary">Permission</label>
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
                        {isPublic && (
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-txt-secondary dark:text-dark-txt-secondary">
                                    Mot de passe {share.hasPassword && <span className="text-emerald-600 dark:text-emerald-400">(actif)</span>}
                                </label>
                                <div className="flex gap-1.5">
                                    <input
                                        type="password"
                                        placeholder={share.hasPassword ? 'Nouveau mot de passe' : 'Ajouter un mot de passe'}
                                        value={passwordInputs[share.id] ?? ''}
                                        disabled={isPending}
                                        onChange={e => setPasswordInputs(prev => ({ ...prev, [share.id]: e.target.value }))}
                                        className="flex-1 text-xs rounded-lg border border-border-subtle dark:border-dark-border-subtle bg-surface dark:bg-dark-main-bg text-txt-primary dark:text-dark-txt-primary px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-action dark:focus:ring-dark-action disabled:opacity-50"
                                    />
                                    <button
                                        onClick={() => handleUpdatePassword(share.id, passwordInputs[share.id] || null)}
                                        disabled={isPending || !passwordInputs[share.id]}
                                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-action dark:bg-dark-action text-white disabled:opacity-40 transition-opacity"
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
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-txt-secondary dark:text-dark-txt-secondary">Expiration</label>
                                {share.expiresAt && (
                                    <button
                                        onClick={() => handleUpdateExpiry(share.id, null)}
                                        disabled={isPending}
                                        className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50 transition-colors"
                                    >
                                        Désactiver
                                    </button>
                                )}
                            </div>
                            <input
                                type="date"
                                className={selectClass}
                                value={dateInputs[share.id] ?? toDateInputValue(share.expiresAt)}
                                min={new Date().toISOString().slice(0, 10)}
                                disabled={isPending}
                                onChange={e => setDateInputs(prev => ({ ...prev, [share.id]: e.target.value }))}
                                onBlur={e => {
                                    const val = e.target.value;
                                    if (!val) {
                                        handleUpdateExpiry(share.id, null);
                                        return;
                                    }
                                    const date = new Date(val + 'T12:00:00');
                                    if (!isNaN(date.getTime())) {
                                        handleUpdateExpiry(share.id, date.toISOString());
                                    } else {
                                        setDateInputs(prev => ({ ...prev, [share.id]: toDateInputValue(share.expiresAt) }));
                                    }
                                }}
                            />
                        </div>
                        <button
                            onClick={() => handleDelete(share.id)}
                            disabled={isPending}
                            className="flex items-center justify-center gap-2 w-full mt-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
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
    };

    return (
        <div className="grid grid-cols-2 gap-x-6">
            {/* Colonne Publique */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-200 dark:border-blue-800">
                    <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/30">
                        <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Liens publics</span>
                    <span className="ml-auto text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full">{publicShares.length}</span>
                </div>
                {publicShares.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-1.5 text-txt-secondary dark:text-dark-txt-secondary opacity-50">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <p className="text-xs">Aucun lien public</p>
                    </div>
                ) : publicShares.map(share => renderSharePanel(share, true))}
            </div>

            {/* Colonne Privée */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-purple-200 dark:border-purple-800">
                    <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-900/30">
                        <svg className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">Partages privés</span>
                    <span className="ml-auto text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded-full">{privateShares.length}</span>
                </div>
                {privateShares.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-1.5 text-txt-secondary dark:text-dark-txt-secondary opacity-50">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-xs">Aucun partage privé</p>
                    </div>
                ) : privateShares.map(share => renderSharePanel(share, false))}
            </div>
        </div>
    );
}
