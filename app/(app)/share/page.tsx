'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocketEvent } from '@/src/hooks/useSocketEvent';
import { FolderShareDetailResponse, getReceivedSharesAPI } from "@/src/api/share";
import Folders from "@/src/components/Folders";
import { getFolderById } from "@/src/api/folders";
import CreateFolderModal from "@/src/components/modal/CreateFolderModal";
import UploadFileModal from "@/src/components/modal/UploadFileModal";
import SentSharesList from "@/src/components/share/SentSharesList";
import ViewToolbar from "@/src/components/layout/ViewToolbar";


export default function ShowShareFolders() {
    const [folderId, setFolderId] = useState<string>('');
    const [folderData, setFolderData] = useState<FolderShareDetailResponse | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: number | null; name: string }[]>([]);
    const [contextPermission, setContextPermission] = useState<'READ' | 'WRITE' | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [createFolderOpen, setCreateFolderOpen] = useState(false);
    const [addFileOpen, setAddFileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

    const canWrite = folderId !== '' && contextPermission === 'WRITE';

    const fetchShareData = useCallback(async () => {
        try {
            const data = await getReceivedSharesAPI();
            setFolderData(data);
        } catch {
            setFolderData(null);
        }
    }, []);

    useSocketEvent('share:received', useCallback(() => { fetchShareData(); }, [fetchShareData]));

    async function fetchFolderData() {
        try {
            const data = await getFolderById({ folderId });
            setFolderData(data);
        } catch {
            setFolderData(null);
        }
    }

    useEffect(() => {
        if (!folderId) { fetchShareData(); }
    }, [folderId, fetchShareData]);

    async function changeFolderId(newFolderIdNumber: number | null) {
        const newFolderId = newFolderIdNumber?.toString() ?? '';
        setFolderId(newFolderId);
        if (!newFolderId) {
            setBreadcrumbs([]);
            setContextPermission(null);
            return;
        }
        if (!folderId) {
            const clickedFolder = folderData?.folders.find(f => f.id === newFolderIdNumber);
            if (clickedFolder?.permission) {
                setContextPermission(clickedFolder.permission);
            }
        }
        try {
            const data = await getFolderById({ folderId: newFolderId });
            setFolderData(data);
            setBreadcrumbs(data.breadcrumbs);
        } catch {
            setFolderData(null);
        }
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-txt-primary dark:text-dark-txt-primary mb-4">
                Partages
            </h1>

            <div className="flex gap-1 p-1 bg-surface dark:bg-dark-surface rounded-xl w-fit mb-6">
                <button
                    onClick={() => { setActiveTab('received'); setFolderId(''); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'received' ? 'bg-action dark:bg-dark-action text-white' : 'text-txt-secondary dark:text-dark-txt-secondary hover:text-txt-primary dark:hover:text-dark-txt-primary'}`}
                >
                    Partagés avec moi
                </button>
                <button
                    onClick={() => setActiveTab('sent')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'sent' ? 'bg-action dark:bg-dark-action text-white' : 'text-txt-secondary dark:text-dark-txt-secondary hover:text-txt-primary dark:hover:text-dark-txt-primary'}`}
                >
                    Mes partages envoyés
                </button>
            </div>

            {activeTab === 'sent' ? (
                <SentSharesList />
            ) : (
                <>
                    <div className="flex flex-row items-center justify-between mb-6">
                        <nav className="text-sm text-txt-secondary dark:text-dark-txt-secondary" aria-label="Breadcrumb">
                            <ol className="list-none p-0 inline-flex">
                                <li className="flex items-center">
                                    <button onClick={() => changeFolderId(null)} className="hover:underline focus:outline-none cursor-pointer">
                                        Partagés
                                    </button>
                                    {breadcrumbs.slice(1).map((crumb) => (
                                        <span key={crumb.id} className="flex items-center">
                                            <svg className="size-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <button onClick={() => changeFolderId(crumb.id)} className="hover:underline focus:outline-none cursor-pointer">
                                                {crumb.name}
                                            </button>
                                        </span>
                                    ))}
                                </li>
                            </ol>
                        </nav>
                        <div className="flex flex-row items-center space-x-4">
                            <ViewToolbar viewMode={viewMode} onViewModeChange={setViewMode} onRefresh={fetchShareData} />
                            {canWrite && (
                                <>
                                    <button className="flex flex-row bg-action dark:bg-dark-action hover:bg-action-hover dark:hover:bg-dark-action-hover text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300" onClick={() => setCreateFolderOpen(true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                        </svg>
                                        Nouveau Dossier
                                    </button>
                                    <button className="flex flex-row bg-action dark:bg-dark-action hover:bg-action-hover dark:hover:bg-dark-action-hover text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300" onClick={() => setAddFileOpen(true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                        Nouveau Fichier
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <Folders
                        listFolders={folderData?.folders || []}
                        listFiles={folderData?.files || []}
                        changeFolderId={changeFolderId}
                        viewMode={viewMode}
                        contextPermission={contextPermission}
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
                </>
            )}
        </>
    );
}
