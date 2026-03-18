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
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: number | null; name: string }[]>([]);
    const [contextPermission, setContextPermission] = useState<'READ' | 'WRITE' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    async function fetchShareData(){
            setError(null);
            try {
                const data = await getReceivedSharesAPI();
                setFolderData(data);
            } catch {
                setFolderData(null);
            }
    }
    
    useEffect(() => {

        fetchShareData();

    }, [folderId]);


    async function changeFolderId(newFolderIdNumber: number | null) {
        const newFolderId = newFolderIdNumber?.toString() ?? '';
        setFolderId(newFolderId);
        if (!newFolderId) {
            setBreadcrumbs([]);
            setContextPermission(null);
            return;
        }
        // Si on est à la racine, on capture la permission du dossier cliqué
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
                    <nav className="text-sm text-txt-secondary dark:text-dark-txt-secondary mt-1" aria-label="Breadcrumb">
                        <ol className="list-none p-0 inline-flex">
                            <li className="flex items-center">
                                <button
                                    onClick={() => changeFolderId(null)}
                                    className="hover:underline focus:outline-none cursor-pointer"
                                >
                                    Partagés
                                </button>
                                {breadcrumbs.slice(1).map((crumb) => (
                                    <span key={crumb.id} className="flex items-center">
                                        <svg
                                            className="size-4 mx-2 text-txt-secondary dark:text-dark-txt-secondary"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <button
                                            onClick={() => changeFolderId(crumb.id)}
                                            className="hover:underline focus:outline-none cursor-pointer"
                                        >
                                            {crumb.name}
                                        </button>
                                    </span>
                                ))}
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="flex items-center bg-surface dark:bg-dark-surface rounded-lg p-1 space-x-1">
                    
                    <button 
                        onClick={fetchShareData}
                        className='p-1.5 rounded-md transition-colors text-txt-secondary hover:bg-gray-100 dark:hover:bg-gray-700 ml-2'
                        title='rafraichir'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>

                    </button>
                    
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
                contextPermission={contextPermission}
            />
        </Layout>
    );
}