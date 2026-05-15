'use client';

import { StorageStats } from "@/src/interface/storage";

const CATEGORIES = [
    {
        key: 'video' as const,
        label: 'Vidéos',
        color: '#7c6ef8',
        bg: '#7c6ef815',
        icon: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z",
    },
    {
        key: 'photo' as const,
        label: 'Photos',
        color: '#3b82f6',
        bg: '#3b82f615',
        icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
    },
    {
        key: 'document' as const,
        label: 'Documents',
        color: '#f97316',
        bg: '#f9731615',
        icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
    },
    {
        key: 'other' as const,
        label: 'Autres',
        color: '#14b8a6',
        bg: '#14b8a615',
        icon: "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z",
    },
];

function toGo(bytes: number): string {
    return (bytes / (1024 ** 3)).toFixed(1);
}

export default function StorageCard({ stats }: { stats: StorageStats | null }) {
    const usedBytes   = stats?.used_bytes   ?? 0;
    const quotaBytes  = stats?.quota_bytes  ?? 30 * 1024 ** 3;
    const usedPercent = stats?.used_percent ?? 0;

    return (
        <div className="w-full bg-surface dark:bg-dark-surface p-6 rounded-[30px] shadow-xl font-sans">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#7c6ef815] dark:bg-[#9b8ffa15] rounded-xl flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#7c6ef8] dark:text-[#9b8ffa]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-txt-primary dark:text-dark-txt-primary">
                        Détails du stockage
                    </h2>
                </div>
                <span className="text-sm font-medium text-txt-primary/60 dark:text-dark-txt-primary/60">
                    {toGo(usedBytes)} / {toGo(quotaBytes)} Go
                </span>
            </div>

            <div className="w-full h-2 bg-main-bg dark:bg-dark-main-bg rounded-full mb-6 overflow-hidden">
                <div
                    className="h-full rounded-full bg-[#7c6ef8] dark:bg-[#9b8ffa] transition-all duration-500"
                    style={{ width: `${Math.min(usedPercent, 100)}%` }}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map(({ key, label, color, bg, icon }) => {
                    const cat = stats?.categories[key];
                    const go  = cat ? toGo(cat.bytes) : '—';
                    const pct = cat?.percent ?? 0;
                    return (
                        <div key={key} className="p-3 rounded-2xl bg-main-bg dark:bg-dark-main-bg flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-txt-primary dark:text-dark-txt-primary">{label}</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <span className="text-sm font-bold text-txt-primary dark:text-dark-txt-primary">{go} Go</span>
                                <span className="text-xs text-txt-primary/50 dark:text-dark-txt-primary/50">{pct.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface dark:bg-dark-surface rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(pct, 100)}%`, background: color }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
