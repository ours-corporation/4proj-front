'use client';

import { useAuth } from '@/src/hooks/useAuth';
import Loading from '@/src/components/Loading';
import Layout from '@/src/components/layout/Layout';
import Error from '@/src/components/Error';
import { useJwtInformation } from '@/src/hooks/getJwtInformation';
import GlobalCard from '@/src/components/card/GlobalCard';
import ShowRecentFile from '@/src/components/dashboard/ShowRecentFIle';
import StorageChart from '@/src/components/storage/StorageChart';
import { convertFileSize } from '@/src/utils/convert-file-size';
import { useStorageData } from '@/src/hooks/useStorageData';

function StorageIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="url(#dash-grad)" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
    );
}

function ChartIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="url(#dash-grad)" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="url(#dash-grad)" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    );
}

export default function Dashboard() {
    const userInfo    = useJwtInformation();
    const authLoading = useAuth();
    const { usedBytes, totalBytes, categories, loading, isMock } = useStorageData(!authLoading);

    if (authLoading) return <Loading />;
    if (!userInfo)   return <Error errorMsg="Une erreur est survenue lors du chargement des informations utilisateur." />;

    const usedPct = totalBytes > 0 ? ((usedBytes / totalBytes) * 100).toFixed(1) : '0';

    return (
        <Layout currentPage="/dashboard">
            {/* Hidden gradient sprite for SVG stroke references */}
            <svg width="0" height="0" className="absolute overflow-hidden" aria-hidden="true">
                <defs>
                    <linearGradient id="dash-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7c6ef8" />
                        <stop offset="100%" stopColor="#42aff0" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Page heading */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#ededed] mb-1">
                    Bonjour,{" "}
                    <span className="bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent">
                        {userInfo.username}
                    </span>{" "}!
                </h1>
                <p className="text-sm text-[#555]">
                    Retrouvez vos fichiers récents et l&apos;état de votre stockage.
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

                {/* Storage used card */}
                <GlobalCard svgIcon={<StorageIcon />}>
                    <p className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-3">Espace utilisé</p>

                    {loading ? (
                        <div className="space-y-2 mt-1">
                            <div className="h-9 w-32 bg-white/[0.04] rounded-lg animate-pulse" />
                            <div className="h-3 w-full bg-white/[0.04] rounded-full animate-pulse" />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-3xl font-bold text-[#ededed] tracking-tight">
                                    {convertFileSize(usedBytes)}
                                </span>
                                <span className="text-sm text-[#444] font-medium">
                                    / {convertFileSize(totalBytes)}
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-white/[0.05] rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] transition-all duration-700 ease-out"
                                    style={{ width: `${usedPct}%` }}
                                />
                            </div>
                            <p className="text-[11px] text-[#444] mt-2">{usedPct}% utilisé</p>
                        </>
                    )}
                </GlobalCard>

                {/* Storage breakdown card */}
                <div className="md:col-span-2">
                    <GlobalCard svgIcon={<ChartIcon />}>
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">
                                Répartition par type
                            </p>
                            {isMock && (
                                <span className="text-[10px] font-medium text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded-full">
                                    simulé
                                </span>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <svg className="w-6 h-6 animate-spin text-[#444]" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                            </div>
                        ) : (
                            <StorageChart categories={categories} totalBytes={totalBytes} />
                        )}
                    </GlobalCard>
                </div>
            </div>

            {/* Recent files */}
            <GlobalCard svgIcon={<ClockIcon />}>
                <p className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">
                    Fichiers récents
                </p>
                <ShowRecentFile />
            </GlobalCard>
        </Layout>
    );
}
