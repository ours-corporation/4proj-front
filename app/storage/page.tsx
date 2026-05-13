'use client';

import { useAuth } from '@/src/hooks/useAuth';
import Loading from '@/src/components/Loading';
import Layout from '@/src/components/layout/Layout';
import GlobalCard from '@/src/components/card/GlobalCard';
import StorageChart from '@/src/components/storage/StorageChart';
import { convertFileSize } from '@/src/utils/convert-file-size';
import { useStorageData } from '@/src/hooks/useStorageData';

export default function StoragePage() {
    const authLoading = useAuth();
    const { usedBytes, totalBytes, categories, isMock, loading } = useStorageData();

    if (authLoading || loading) return <Loading />;

    const freeBytes = Math.max(0, totalBytes - usedBytes);
    const usedPct   = totalBytes > 0 ? ((usedBytes / totalBytes) * 100).toFixed(1) : '0';

    return (
        <Layout currentPage="/storage">
            <h1 className="text-3xl font-bold text-txt-primary dark:text-dark-txt-primary mb-2">Stockage</h1>
            <p className="text-txt-secondary dark:text-dark-txt-secondary mb-8">
                Visualisez la répartition de votre espace disque par type de fichier.
            </p>

            {isMock && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 text-sm">
                    Les données de répartition sont actuellement simulées — elles seront remplacées dès que l'API sera disponible.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
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
                        </h3>
                        <StorageChart categories={categories} totalBytes={totalBytes} />
                    </GlobalCard>
                </div>

                <div className="flex flex-col gap-6">
                    <GlobalCard
                        svgIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-action dark:text-dark-action">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                            </svg>
                        }
                    >
                        <h3 className="text-txt-primary dark:text-dark-txt-primary font-semibold text-lg mb-4">Espace total</h3>

                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-4xl font-bold text-txt-primary dark:text-dark-txt-primary">
                                {convertFileSize(usedBytes)}
                            </span>
                            <span className="text-txt-secondary dark:text-dark-txt-secondary font-medium">
                                / {convertFileSize(totalBytes)}
                            </span>
                        </div>
                        <p className="text-sm text-txt-secondary dark:text-dark-txt-secondary mb-4">{usedPct}% utilisé</p>

                        <div className="w-full bg-main-bg dark:bg-dark-main-bg rounded-full h-3 overflow-hidden mb-4">
                            <div
                                className="bg-action dark:bg-dark-action h-full rounded-full transition-all duration-500"
                                style={{ width: `${usedPct}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-sm">
                            <div>
                                <p className="text-txt-secondary dark:text-dark-txt-secondary">Utilisé</p>
                                <p className="font-semibold text-txt-primary dark:text-dark-txt-primary">{convertFileSize(usedBytes)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-txt-secondary dark:text-dark-txt-secondary">Disponible</p>
                                <p className="font-semibold text-txt-primary dark:text-dark-txt-primary">{convertFileSize(freeBytes)}</p>
                            </div>
                        </div>
                    </GlobalCard>
                </div>
            </div>
        </Layout>
    );
}
