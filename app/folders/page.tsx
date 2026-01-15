'use client';

import React, {useState, useEffect} from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import Loading from '@/src/components/Loading';
import Layout from '@/src/components/Layout';
import Error from "@/src/components/Error";
import Folders from "@/src/components/Folders";
import {FolderDetailResponse, getFolderById} from "@/src/api/folders";


export default function ShowFolders() {
    const [folderId, setFolderId] = useState<string>(''); // Peut-être initialiser avec une valeur par défaut ou 'root' ?
    const [folderData, setFolderData] = useState<FolderDetailResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fonction interne pour gérer l'async dans le useEffect
        const fetchData = async () => {
            setError(null);
            try {
                const data = await getFolderById({ folderId });
                console.log(data);
                setFolderData(data);
            } catch (err) {
                setFolderData(null);
            }
        };

        fetchData();

    }, [folderId]);
    //--------protection de vérification d'authentification---------
    const loading = useAuth();
    //--------------------------------------------------------------

    if (loading) return <Loading />;
    if (error) { return <Error errorMsg="Une erreur est survenue lors du chargement des informations utilisateur." />; }

    return (
        <Layout currentPage="/folders">
            <div className="flex flex-row items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-txt-primary dark:text-dark-txt-primary">
                    Vos Fichiers
                </h1>

                <div className="flex flex-row items-center space-x-4">
                    <button name="add-folder" className="flex flex-row bg-action dark:bg-dark-action hover:bg-action-hover dark:hover:bg-dark-action-hover text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="size-6 mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"/>
                        </svg>
                        Nouveau Dossier
                    </button>
                    <button name="add-file" className="flex flex-row bg-action dark:bg-dark-action hover:bg-action-hover dark:hover:bg-dark-action-hover text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="size-6 mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                        </svg>
                        Nouveau Fichier
                    </button>
                </div>
            </div>
            <Folders listFolders={folderData?.folders || []} listFiles={folderData?.files || []} />
        </Layout>
    );
}