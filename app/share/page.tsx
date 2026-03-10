'use client';

import React, {useState, useEffect} from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import Loading from '@/src/components/Loading';
import Layout from '@/src/components/layout/Layout';
import Error from "@/src/components/Error";
import {FolderShareDetailResponse, getReceivedSharesAPI} from "@/src/api/share";
import Folders from "@/src/components/Folders";
import {getFolderById} from "@/src/api/folders";


export default function ShowShareFolders() {
    const [folderId, setFolderId] = useState<string>('');
    const [folderData, setFolderData] = useState<FolderShareDetailResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                const data = await getReceivedSharesAPI();
                setFolderData(data);
            } catch {
                setFolderData(null);
            }
        };

        fetchData();

    }, [folderId]);


    async function changeFolderId(newFolderIdNumber: number | null) {
        const newFolderId = newFolderIdNumber?.toString() ?? '';
        setFolderId(newFolderId);
        try {
            const data = await getFolderById({ folderId: newFolderId });
            setFolderData(data);
        } catch (error) {
            setFolderData(null);
        }
    }


    //--------protection de vérification d'authentification---------
    const loading = useAuth();
    //--------------------------------------------------------------

    if (loading) return <Loading />;
    if (error) { return <Error errorMsg="Une erreur est survenue lors du chargement des informations utilisateur." />; }

    return (
        <Layout currentPage="/share">
            <div className="flex flex-row items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-txt-primary dark:text-dark-txt-primary">
                        Vos Fichiers Partagés
                    </h1>
                </div>
                <div className="flex items-center bg-surface dark:bg-dark-surface rounded-lg p-1 space-x-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-action dark:bg-dark-action text-white' : 'text-txt-secondary dark:text-dark-txt-secondary hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        title="Vue grille"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-action dark:bg-dark-action text-white' : 'text-txt-secondary dark:text-dark-txt-secondary hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        title="Vue liste"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <Folders
                listFolders={folderData?.folders || []}
                listFiles={folderData?.files || []}
                changeFolderId={changeFolderId}
                viewMode={viewMode}
            />
        </Layout>
    );
}