'use client';

import { StorageStats } from "@/src/interface/storage";

const CATEGORIES = [
    {
        key: 'video' as const,
        label: 'Vidéos',
        color: '#7c6ef8',
        icon: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z",
    },
    {
        key: 'photo' as const,
        label: 'Photos',
        color: '#42aff0',
        icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
    },
    {
        key: 'document' as const,
        label: 'Documents',
        color: '#f97316',
        icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
    },
    {
        key: 'other' as const,
        label: 'Autres',
        color: '#14b8a6',
        icon: "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z",
    },
];

function fmt(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    if (bytes < 1024 ** 3) return `${(bytes / (1024 ** 2)).toFixed(1)} Mo`;
    return `${(bytes / (1024 ** 3)).toFixed(2)} Go`;
}

export default function StorageCard({ stats }: { stats: StorageStats | null }) {
    const usedBytes  = stats?.used_bytes  ?? 0;
    const quotaBytes = stats?.quota_bytes ?? 30 * 1024 ** 3;
    const usedPct    = stats?.used_percent ?? 0;

    return (
        <div className="bg-[#111113] border border-white/[0.06] rounded-[20px] p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[#7c6ef8]/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#7c6ef8" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-[15px] font-semibold text-[#ededed]">Stockage</h2>
                    <p className="text-[12px] text-[#444]">{fmt(usedBytes)} utilisé sur {fmt(quotaBytes)}</p>
                </div>
            </div>

            {/* Global bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[12px] text-[#555]">Espace utilisé</span>
                    <span className="text-[12px] font-semibold text-[#888]">{usedPct.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] transition-all duration-700"
                        style={{ width: `${Math.min(usedPct, 100)}%` }}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map(({ key, label, color, icon }) => {
                    const cat = stats?.categories[key];
                    const pct = cat?.percent ?? 0;
                    return (
                        <div key={key} className="p-3 rounded-[12px] bg-[#0d0d0d] border border-white/[0.04]">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                                    </svg>
                                </div>
                                <span className="text-[12px] font-medium text-[#888]">{label}</span>
                            </div>
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-sm font-bold text-[#ccc]">{cat ? fmt(cat.bytes) : '—'}</span>
                                <span className="text-[11px] text-[#444]">{pct.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
