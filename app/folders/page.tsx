'use client';

import React, {useState, useEffect} from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import Loading from '@/src/components/Loading';
import Layout from '@/src/components/Layout';
import Error from "@/src/components/Error";
import Folders from "@/src/components/Folders";
import {createNewFolderAPI, FolderDetailResponse, getFolderById} from "@/src/api/folders";
import Modal from "@/src/components/modal/Modal";
import InputField from "@/src/components/input/InputField";
import InputFile from "@/src/components/input/InputFile";
import SubmitButton from "@/src/components/button/SubmitButton";
import { uploadFileAPI } from '@/src/api/file';


export default function ShowFolders() {
    const [folderId, setFolderId] = useState<string>('');
    const [folderData, setFolderData] = useState<FolderDetailResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [ createFolderOpen, setCreateFolderOpen ] = useState<boolean>(false);
    const [folderName, setFolderName] = useState<string>("");

    const [ addFileOpen, setAddFileOpen ] = useState<boolean>(false);
    const [file , setFile] = useState<File | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                const data = await getFolderById({ folderId });
                setFolderData(data);
            } catch (err) {
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

    async function createNewFolder() {
        try {
            const newFolder = await createNewFolderAPI(folderName, folderId ? parseInt(folderId) : null);
            const data = await getFolderById({ folderId });
            setFolderData(data);
            setFolderName("");
            setCreateFolderOpen(false);
        } catch (error) {
            console.error("Erreur lors de la création du dossier :", error);
        }
    }

    async function uploadFile() {

        const repUploadFile = await uploadFileAPI(file, folderId ? parseInt(folderId) : null);

        if (repUploadFile.ok) {
            const data = await getFolderById({ folderId });
            setFolderData(data);
            setFile(null);
            setAddFileOpen(false);
        } else {
            console.error("Erreur lors de l'upload du fichier :", repUploadFile.statusText);
        }
    }


    //--------protection de vérification d'authentification---------
    const loading = useAuth();
    //--------------------------------------------------------------

    if (loading) return <Loading />;
    if (error) { return <Error errorMsg="Une erreur est survenue lors du chargement des informations utilisateur." />; }

    return (
        <Layout currentPage="/folders">
            <div className="flex flex-row items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-txt-primary dark:text-dark-txt-primary">
                        Vos Fichiers
                    </h1>
                    <nav className="text-sm text-txt-secondary dark:text-dark-txt-secondary mt-1" aria-label="Breadcrumb">
                        <ol className="list-none p-0 inline-flex">
                            <li className="flex items-center">
                                {folderData?.breadcrumbs.map((crumb, index) => (
                                    <span key={crumb.id} className="flex items-center">
                                        <button
                                            onClick={() => changeFolderId(crumb.id)}
                                            className="hover:underline focus:outline-none cursor-pointer"
                                        >
                                            {crumb.name}
                                        </button>
                                        {index < (folderData.breadcrumbs.length - 1) && (
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
                                        )}
                                    </span>
                                ))}
                            </li>
                        </ol>
                    </nav>
                </div>


                <div className="flex flex-row items-center space-x-4">
                    <button name="add-folder" className="flex flex-row bg-action dark:bg-dark-action hover:bg-action-hover dark:hover:bg-dark-action-hover text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 mr-4"
                        onClick={() => setCreateFolderOpen(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="size-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"/>
                        </svg>
                        Nouveau Dossier
                    </button>
                    <button name="add-file" className="flex flex-row bg-action dark:bg-dark-action hover:bg-action-hover dark:hover:bg-dark-action-hover text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        onClick={() => setAddFileOpen(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="size-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                        </svg>
                        Nouveau Fichier
                    </button>
                </div>
            </div>
            <Folders
                listFolders={folderData?.folders || []}
                listFiles={folderData?.files || []}
                changeFolderId={changeFolderId}
            />

            <Modal
                size="small"
                isOpen={createFolderOpen}
                title={"Création d'un nouveau dossier"}
                onClose={() => setCreateFolderOpen(false)}
            >
                <div className="space-y-6">
                    <InputField
                        id="new-folder-name"
                        label="Nom du dossier"
                        value={folderName}
                        type={"text"}
                        onChange={setFolderName}
                    />

                    {folderId}

                    <SubmitButton
                        id="create-folder-button"
                        type="button"
                        text="Créer le dossier"
                        onClick={async () => { await createNewFolder(); }}
                    />
                </div>

            </Modal>

            <Modal
                size="small"
                title="Ajouter un fichier"
                isOpen={addFileOpen}
                onClose={() => setAddFileOpen(false)}
            >
                <div className="space-y-6">
                    <InputFile
                        id="file-upload"
                        label="Sélectionner un fichier"
                        value={file}
                        onChange={setFile}
                        accept="*/*"
                        required
                    />

                    <SubmitButton
                        id="add-file-button"
                        type="button"
                        text="Ajouter le fichier"
                        onClick={async () => { await uploadFile(); }}
                    />
                </div>
            </Modal>
        </Layout>
    );
}