'use client';

import React, {useState, useEffect} from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import Loading from '@/src/components/Loading';
import Layout from '@/src/components/Layout';
import Error from "@/src/components/Error";
import {FolderShareDetailResponse, getReceivedSharesAPI} from "@/src/api/share";
import Folders from "@/src/components/Folders";
import {getFolderById} from "@/src/api/folders";


export default function ShowShareFolders() {
    const [folderId, setFolderId] = useState<string>('');
    const [folderData, setFolderData] = useState<FolderShareDetailResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

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
            </div>
            <Folders
                listFolders={folderData?.folders || []}
                listFiles={folderData?.files || []}
                changeFolderId={changeFolderId}
            />
        </Layout>
    );
}