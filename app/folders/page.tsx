'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import Loading from '@/src/components/Loading';
import Layout from '@/src/components/layout/Layout';
import Error from "@/src/components/Error";
import Folders from "@/src/components/Folders";
import { FolderDetailResponse, getFolderById } from "@/src/api/folders";
import CreateFolderModal from "@/src/components/modal/CreateFolderModal";
import UploadFileModal from "@/src/components/modal/UploadFileModal";
import ViewToolbar from "@/src/components/layout/ViewToolbar";

function FoldersContent() {
    const searchParams = useSearchParams();
    const [folderId, setFolderId] = useState<string>(searchParams.get('folderId') ?? '');
    const [folderData, setFolderData] = useState<FolderDetailResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [createFolderOpen, setCreateFolderOpen] = useState(false);
    const [addFileOpen, setAddFileOpen] = useState(false);

    useEffect(() => { setFolderId(searchParams.get('folderId') ?? ''); }, [searchParams]);

    async function fetchFolderData() {
        setError(null);
        try {
            const data = await getFolderById({ folderId });
            setFolderData(data);
        } catch { setFolderData(null); }
    }

    useEffect(() => { fetchFolderData(); }, [folderId]);

    async function changeFolderId(newFolderIdNumber: number | null) {
        const newFolderId = newFolderIdNumber?.toString() ?? '';
        setFolderId(newFolderId);
        try {
            const data = await getFolderById({ folderId: newFolderId });
            setFolderData(data);
        } catch { setFolderData(null); }
    }

    const loading = useAuth();
    if (loading) return <Loading />;
    if (error) return <Error errorMsg="Une erreur est survenue lors du chargement des informations utilisateur." />;

    return (
        <Layout currentPage="/folders">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-[#ededed]">Mes Fichiers</h1>

                    {/* Breadcrumb */}
                    {folderData?.breadcrumbs && folderData.breadcrumbs.length > 0 && (
                        <nav className="flex items-center gap-1 mt-1.5" aria-label="Breadcrumb">
                            {folderData.breadcrumbs.map((crumb, index) => (
                                <span key={crumb.id} className="flex items-center gap-1">
                                    <button
                                        onClick={() => changeFolderId(crumb.id)}
                                        className={`text-[13px] transition-colors hover:text-[#ededed] ${
                                            index === folderData.breadcrumbs.length - 1
                                                ? 'text-[#7c6ef8] font-medium'
                                                : 'text-[#444]'
                                        }`}
                                    >
                                        {crumb.name}
                                    </button>
                                    {index < folderData.breadcrumbs.length - 1 && (
                                        <svg className="w-3.5 h-3.5 text-[#333]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </span>
                            ))}
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <ViewToolbar viewMode={viewMode} onViewModeChange={setViewMode} onRefresh={fetchFolderData} />

                    <button
                        onClick={() => setCreateFolderOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-[10px] border border-white/[0.08] bg-white/[0.03] text-[#aaa] text-sm hover:text-[#ededed] hover:border-white/[0.15] transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                        </svg>
                        Nouveau dossier
                    </button>

                    <button
                        onClick={() => setAddFileOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-sm font-medium hover:opacity-90 transition-all shadow-[0_0_20px_rgba(124,110,248,0.2)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        Importer
                    </button>
                </div>
            </div>

            <Folders
                listFolders={folderData?.folders || []}
                listFiles={folderData?.files || []}
                changeFolderId={changeFolderId}
                viewMode={viewMode}
                onFolderRenamed={fetchFolderData}
                onFileChanged={fetchFolderData}
            />

            <CreateFolderModal
                isOpen={createFolderOpen}
                onClose={() => setCreateFolderOpen(false)}
                parentFolderId={folderId ? parseInt(folderId) : null}
                onSuccess={fetchFolderData}
            />

            <UploadFileModal
                isOpen={addFileOpen}
                onClose={() => setAddFileOpen(false)}
                parentFolderId={folderId ? parseInt(folderId) : null}
                onSuccess={fetchFolderData}
            />
        </Layout>
    );
}

export default function ShowFolders() {
    return (
        <Suspense fallback={<Loading />}>
            <FoldersContent />
        </Suspense>
    );
}
