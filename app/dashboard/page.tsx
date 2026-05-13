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

export default function Dashboard() {
    const userInfo    = useJwtInformation();
    const authLoading = useAuth();
    const { usedBytes, totalBytes, categories, loading, isMock } = useStorageData();

    if (authLoading) return <Loading />;
    if (!userInfo)   return <Error errorMsg="Une erreur est survenue lors du chargement des informations utilisateur." />;

    const usedPct = totalBytes > 0 ? ((usedBytes / totalBytes) * 100).toFixed(1) : '0';

    return (
        <Layout currentPage="/dashboard">
            <h1 className="text-3xl font-bold text-txt-primary dark:text-dark-txt-primary mb-2">
                Bonjour, {userInfo.username} !
            </h1>
            <p className="text-txt-secondary dark:text-dark-txt-secondary mb-8">
                Retrouvez vos fichiers récents et dossiers partagés.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Espace utilisé */}
                <GlobalCard
                    svgIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5E81F4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                    }
                >
                    <div className="mb-6">
                        <h3 className="text-txt-primary dark:text-dark-txt-primary font-medium text-md mb-1">Espace Utilisé</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-txt-primary dark:text-dark-txt-primary tracking-tight">
                                {convertFileSize(usedBytes)}
                            </span>
                            <span className="text-txt-secondary dark:text-dark-txt-secondary text-lg font-medium">
                                / {convertFileSize(totalBytes)}
                            </span>
                        </div>
                    </div>
                    <div className="w-full bg-main-bg dark:bg-dark-main-bg rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-action dark:bg-dark-action h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${usedPct}%` }}
                        />
                    </div>
                </GlobalCard>

                {/* Répartition par type */}
                <div className="md:col-span-2">
                    <GlobalCard
                        svgIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-action dark:text-dark-action">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                            </svg>
                        }
                    >
                        <h3 className="text-txt-primary dark:text-dark-txt-primary font-semibold text-lg mb-6">
                            Répartition par type
                            {isMock && <span className="ml-2 text-xs font-normal text-yellow-500">(simulé)</span>}
                        </h3>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <svg className="w-8 h-8 animate-spin text-txt-secondary dark:text-dark-txt-secondary" fill="none" viewBox="0 0 24 24">
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

            <h2 className="text-xl font-bold text-txt-secondary dark:text-dark-txt-primary mb-2">
                Fichiers Récents
            </h2>
            <ShowRecentFile />
        </Layout>
    );
}
