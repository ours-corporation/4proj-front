'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { useSocketEvent } from '@/src/hooks/useSocketEvent';
import Loading from '@/src/components/Loading';
import Layout from '@/src/components/layout/Layout';
import { getTrashAPI, TrashResponse } from '@/src/api/trash';
import Folders from '@/src/components/Folders';
import Modal from "@/src/components/modal/Modal";
import DeleteTrashModal from "@/src/components/modal/DeleteTrash";
import {restoreFolder} from "@/src/api/folders";
import { restoreFile } from '@/src/api/file';
import { FolderResponse } from '@/src/interface/folder';
import { FileResponse } from '@/src/interface/file';

export default function TrashPage() {
    const [trashData, setTrashData] = useState<TrashResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [cleanTrashOpen, setCleanTrashOpen] = useState<boolean>(false);

    const fetchTrash = useCallback(() => {
        setLoading(true);
        getTrashAPI()
            .then(setTrashData)
            .catch(() => setTrashData({ folders: [], files: [] }))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchTrash(); }, [fetchTrash]);

    useSocketEvent('file:trashed', useCallback(() => { fetchTrash(); }, [fetchTrash]));
    useSocketEvent('file:restored', useCallback(() => { fetchTrash(); }, [fetchTrash]));
    useSocketEvent('file:deleted', useCallback(() => { fetchTrash(); }, [fetchTrash]));
    useSocketEvent('folder:trashed', useCallback(() => { fetchTrash(); }, [fetchTrash]));
    useSocketEvent('folder:restored', useCallback(() => { fetchTrash(); }, [fetchTrash]));
    useSocketEvent('folder:deleted', useCallback(() => { fetchTrash(); }, [fetchTrash]));
    useSocketEvent('trash:emptied', useCallback(() => { fetchTrash(); }, [fetchTrash]));

    const authLoading = useAuth();
    if (authLoading || loading) return <Loading />;

    const folders = trashData?.folders ?? [];
    const files = trashData?.files ?? [];
    const total = folders.length + files.length;

    async function restoreFolderFromTrash(folder:FolderResponse){
        setLoading(true);
        setError(null);
        
        try{
            await restoreFolder(folder.id);
            await fetchTrash();
        }
        catch {
            setError("Une erreur est survenue lors de la restauration.");
        } finally {
            setLoading(false);
        }
    }

    async function restoreFileFromTrash(file:FileResponse){
        setLoading(true);
        setError(null);
        
        try{
            await restoreFile(file.id);
            await fetchTrash();
        }
        catch {
            setError("Une erreur est survenue lors de la restauration.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout currentPage="/trash">
            <div className="flex flex-row items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-txt-primary dark:text-dark-txt-primary">
                        Corbeille
                    </h1>
                    <p className="text-sm text-txt-secondary dark:text-dark-txt-secondary mt-1">
                        {total} élément{total !== 1 ? 's' : ''}
                    </p>
                </div>
                {total > 0 && (
                
                    <div className="flex items-center bg-surface dark:bg-dark-surface rounded-lg p-1 space-x-1.5">
                        <button 
                            onClick={fetchTrash}
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

                        <button name="clear-trash" className="flex flex-row bg-action dark:bg-dark-action hover:bg-action-hover dark:hover:bg-dark-action-hover text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 mr-4"
                        onClick={() => setCleanTrashOpen(true)}
                    >
                       <div className="flex justify-center items-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                <g transform="scale(1.5) translate(-3,-3)">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                                </g>
                            </svg>
                        </div>

                        Vider la corbeille
                    </button>
                    </div>
                )}
            </div>

            {total === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-txt-secondary dark:text-dark-txt-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 opacity-30">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    <p className="text-lg font-medium">La corbeille est vide</p>
                </div>
            ) : (
                <Folders
                    listFolders={folders}
                    listFiles={files}
                    changeFolderId={async () => {}}
                    viewMode={viewMode}
                    contextPermission="READ"

                    isTrash={true}
                    restoreFolder={restoreFolderFromTrash}
                    restoreFile={restoreFileFromTrash}
                />
            )}
            <DeleteTrashModal
            isOpen={cleanTrashOpen}
            closeModal = {() => setCleanTrashOpen(false)}
            >

            </DeleteTrashModal>
        </Layout>
    );
}
