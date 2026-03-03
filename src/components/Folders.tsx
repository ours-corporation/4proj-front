import React, {useState, useEffect} from 'react';

import { FolderResponse } from '@/src/interface/folder';
import {FileResponse} from "@/src/interface/file";

import FileCard from "@/src/components/card/FileCard";
import Modal from "@/src/components/modal/Modal";
import ImgPreview from "@/src/components/preview/imgPreview";
import { downloadFile, getFileThumbnail } from '@/src/api/file';
import PdfPreview from "@/src/components/preview/pdfPreview";
import VideoPreview from "@/src/components/preview/videoPreview";
import AudioPreview from "@/src/components/preview/audioPreview";
import TextPreview from "@/src/components/preview/textPreview";
import JsonPreview from "@/src/components/preview/jsonPreview";
import FolderCard from "@/src/components/card/FolderCard";
import {convertFileSize} from "@/src/utils/convert-file-size";
import {getFileColor} from "@/src/utils/get-file-color";
import {getFileSvg} from "@/src/utils/get-file-svg";
import UpdateFileModal from "@/src/components/modal/UpdateFile";
import ShareFileModal from "@/src/components/modal/ShareFile";
import DeleteFileModal from "@/src/components/modal/DeleteFile";
import DeleteFolderModal from "@/src/components/modal/DeleteFolder";
import RenameFolderModal from "@/src/components/modal/RenameFolder";


interface FoldersProps {
    listFolders: FolderResponse[];
    listFiles?: FileResponse[];
    changeFolderId: (newFolderIdNumber: number | null) => Promise<void>;
    viewMode?: 'grid' | 'list';
}

export default function Folders({ listFolders, listFiles, changeFolderId, viewMode = 'grid' }: FoldersProps) {
    const [open, setOpen] = useState(false);
    const [openListMenuId, setOpenListMenuId] = useState<string | null>(null);
    const [thumbnails, setThumbnails] = useState<Record<number, string>>({});

    useEffect(() => {
        if (!listFiles) return;
        const imageFiles = listFiles.filter(f => f.mime_type.startsWith('image/'));
        if (imageFiles.length === 0) return;

        const objectUrls: string[] = [];

        imageFiles.forEach(f => {
            getFileThumbnail(f.id, 'small')
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    objectUrls.push(url);
                    setThumbnails(prev => ({ ...prev, [f.id]: url }));
                })
                .catch(() => {});
        });

        return () => {
            objectUrls.forEach(u => URL.revokeObjectURL(u));
        };
    }, [listFiles]);

    useEffect(() => {
        if (openListMenuId === null) return;
        function handleClickOutside() { setOpenListMenuId(null); }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openListMenuId]);
    const [selectedFile, setSelectedFile] = useState<FileResponse | null>(null);
    const [file , setFile] = useState<File | null>(null);
    const [fileLoading, setFileLoading] = useState(false);

    //Edit file modal
    const [ openUpdateModal, setOpenUpdateModal ] = useState<boolean>(false);
    const [ editFileInfo, setEditFileInfo ] = useState<FileResponse | null>(null);

    //Share file modal
    const [ openShareModal, setOpenShareModal ] = useState<boolean>(false);
    const [ shareFileInfo, setShareFileInfo ] = useState<FileResponse | null>(null);

    //Delete file modal
    const [ openDeleteModal, setOpenDeleteModal ] = useState<boolean>(false);
    const [ deleteFileInfo, setDeleteFileInfo ] = useState<FileResponse | null>(null);

    //Rename folder modal
    const [ openRenameFolderModal, setOpenRenameFolderModal ] = useState<boolean>(false);
    const [ renameFolderInfo, setRenameFolderInfo ] = useState<FolderResponse | null>(null);

    //Delete folder modal
    const [ openDeleteFolderModal, setOpenDeleteFolderModal ] = useState<boolean>(false);
    const [ deleteFolderInfo, setDeleteFolderInfo ] = useState<FolderResponse | null>(null);


    function setFileInformationAndOpen(file: FileResponse) {
        setSelectedFile(file);
        setFile(null);
        setFileLoading(true);
        setOpen(true);
        const fileDownload = async () => {
            const downloadedFile = await downloadFile({ fileId: file.id });
            setFile(downloadedFile);
            setFileLoading(false);
        }
        fileDownload();
    }

    function setFileInformationAndClose() {
        setOpen(false);
        setSelectedFile(null);
        setFile(null);
        setFileLoading(false);
    }

    async function downloadFileById(fileId: number | null, fileName: string) {
        if (!fileId) return;
        if (!fileName) return;
        try {
            const downloadedData = await downloadFile({ fileId });
            const url = window.URL.createObjectURL(downloadedData);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
        }
    }

    //File edit modal
    async function openUpdateFileModal(file: FileResponse){
        if (!file) return;
        setEditFileInfo(file);
        setOpenUpdateModal(true);
    }

    async function closeUploadFileModal() : Promise<void> {
        setEditFileInfo(null);
        setOpenUpdateModal(false);
    }

    //Share file modal
    async function openShareFileModal(file: FileResponse){
        if (!file) return;
        setShareFileInfo(file);
        setOpenShareModal(true);
    }

    async function closeShareFileModal() : Promise<void> {
        setShareFileInfo(null);
        setOpenShareModal(false);
    }

    //Delete file modal
    async function openDeleteFileModal(file: FileResponse){
        if (!file) return;
        setDeleteFileInfo(file);
        setOpenDeleteModal(true);
    }

    async function closeDeleteFileModal() : Promise<void> {
        setDeleteFileInfo(null);
        setOpenDeleteModal(false);
    }

    //Rename folder modal
    function openRenameFolderModalFn(folder: FolderResponse) {
        setRenameFolderInfo(folder);
        setOpenRenameFolderModal(true);
    }

    function closeRenameFolderModal() {
        setRenameFolderInfo(null);
        setOpenRenameFolderModal(false);
    }

    //Delete folder modal
    function openDeleteFolderModalFn(folder: FolderResponse) {
        setDeleteFolderInfo(folder);
        setOpenDeleteFolderModal(true);
    }

    function closeDeleteFolderModal() {
        setDeleteFolderInfo(null);
        setOpenDeleteFolderModal(false);
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const renderPreviewContent = () => {
        if (!selectedFile) return null;

        if (fileLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-[300px] gap-4 text-gray-400">
                    <svg className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="text-sm">Chargement du fichier...</span>
                </div>
            );
        }

        const mimeType = selectedFile.mime_type;

        if (mimeType.startsWith('image/')) {
            return (
                <ImgPreview
                    file={file!}
                    fileInformation={selectedFile!}
                    onClose={() => setFileInformationAndClose()}
                />
            );
        }

        if (mimeType === 'application/pdf') {
            return (
                <PdfPreview
                    file={file!}
                    fileInformation={selectedFile!}
                    onClose={() => setFileInformationAndClose()}
                />
            );
        }

        //gestion des vidéos
        if (mimeType.startsWith('video/')) {
            return (
                <VideoPreview
                    file={file!}
                    fileInformation={selectedFile!}
                    onClose={() => setFileInformationAndClose()}
                />
            );
        }

        if (mimeType.startsWith('audio/')) {
            return (
                <AudioPreview
                    file={file!}
                    fileInformation={selectedFile!}
                    onClose={() => setFileInformationAndClose()}
                />
            );
        }

        if (mimeType === 'text/plain') {
            console.log("test")
            console.log(selectedFile);
            console.log("test 2")
            console.log(file);
            return (
                <TextPreview
                    file={file!}
                    fileInformation={selectedFile!}
                    onClose={() => setFileInformationAndClose()}
                />
            );
        }

        if (mimeType === 'application/json') {
            return (
                <JsonPreview
                    file={file!}
                    fileInformation={selectedFile!}
                    onClose={() => setFileInformationAndClose()}
                />
            );
        }

        return <p>Aperçu non disponible pour ce type de fichier.</p>;
    };

    const folderColor = "#F59E0B";
    const folderBgColor = "#F59E0B20";

    return (
        <>
        {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {listFolders.map((folder) => (
                <div
                    key={folder.id}
                    className="bg-surface dark:bg-dark-surface p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
                    onClick={() => changeFolderId(folder.id)}
                >
                    <FolderCard
                        folder={folder}
                        renameFolder={openRenameFolderModalFn}
                        deleteFolder={openDeleteFolderModalFn}
                    />
                </div>
            ))}
            {listFiles && listFiles.map((file) => (
                <div key={file.id}
                    className="bg-white dark:bg-dark-surface p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 w-full max-w-xs cursor-pointer"
                    onClick={() => setFileInformationAndOpen(file)}
                >
                    <FileCard
                        file={file}
                        thumbnailUrl={thumbnails[file.id]}
                        downloadFile={downloadFileById}
                        editFile={openUpdateFileModal}
                        shareFile={openShareFileModal}
                        deleteFile={openDeleteFileModal}
                    />
                </div>
            ))}
        </div>
        ) : (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            {listFolders.map((folder) => (
                <div key={folder.id} className="flex items-center py-3 px-2 hover:bg-gray-50 dark:hover:bg-dark-surface rounded-lg">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0"
                        style={{ backgroundColor: folderBgColor, color: folderColor }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                        </svg>
                    </div>
                    <button className="flex-1 text-left min-w-0 mr-3" onClick={() => changeFolderId(folder.id)}>
                        <span className="font-medium text-gray-900 dark:text-white truncate block">{folder.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Dossier</span>
                    </button>
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenListMenuId(openListMenuId === `folder-${folder.id}` ? null : `folder-${folder.id}`);
                            }}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                        >
                            ⋯
                        </button>
                        {openListMenuId === `folder-${folder.id}` && (
                            <div className="absolute right-0 w-40 bg-main-bg dark:bg-dark-main-bg rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                <button
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={(e) => { e.stopPropagation(); openRenameFolderModalFn(folder); setOpenListMenuId(null); }}
                                >
                                    Renommer
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={(e) => { e.stopPropagation(); openDeleteFolderModalFn(folder); setOpenListMenuId(null); }}
                                >
                                    Supprimer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {listFiles && listFiles.map((file) => (
                <div key={file.id} className="flex items-center py-3 px-2 hover:bg-gray-50 dark:hover:bg-dark-surface rounded-lg">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 overflow-hidden"
                        style={{ backgroundColor: `${getFileColor(file.mime_type)}20`, color: getFileColor(file.mime_type) }}
                    >
                        {thumbnails[file.id] ? (
                            <img src={thumbnails[file.id]} alt={file.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <img src={getFileSvg(file.mime_type)} alt="File Icon" className="w-6 h-6" />
                        )}
                    </div>
                    <button className="flex-1 text-left min-w-0 mr-3" onClick={() => setFileInformationAndOpen(file)}>
                        <span className="font-medium text-gray-900 dark:text-white truncate block">{file.fullName}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {convertFileSize(file.size_bytes)} · {formatDate(file.updatedAt)}
                        </span>
                    </button>
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenListMenuId(openListMenuId === `file-${file.id}` ? null : `file-${file.id}`);
                            }}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                        >
                            ⋯
                        </button>
                        {openListMenuId === `file-${file.id}` && (
                            <div className="absolute right-0 w-40 bg-main-bg dark:bg-dark-main-bg rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                <button
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                                    onClick={(e) => { e.stopPropagation(); downloadFileById(file.id, file.name); setOpenListMenuId(null); }}
                                >
                                    Télécharger
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={(e) => { e.stopPropagation(); openUpdateFileModal(file); setOpenListMenuId(null); }}
                                >
                                    Renommer
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={(e) => { e.stopPropagation(); openShareFileModal(file); setOpenListMenuId(null); }}
                                >
                                    Partager
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={(e) => { e.stopPropagation(); openDeleteFileModal(file); setOpenListMenuId(null); }}
                                >
                                    Supprimer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
        )}

            {/* Show details modal */}
            <Modal
                isOpen={open}
                title={selectedFile ? selectedFile.name : 'Détails du fichier'}
                onClose={() => setFileInformationAndClose()}
            >
                <div className="space-y-6">
                    {renderPreviewContent()}
                    <div className="bg-main-bg dark:bg-dark-surface rounded-xl p-4 border border-border-subtle dark:border-dark-border-subtle">
                        <h3 className="text-xs font-semibold text-txt-primary dark:text-dark-txt-primary uppercase tracking-wider mb-3">
                            Métadonnées
                        </h3>
                        <dl className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                            <div>
                                <dt className="text-txt-primary dark:text-dark-txt-primary mb-1">Nom du fichier</dt>
                                <dd className="font-medium text-txt-secondary dark:text-dark-txt-secondary truncate" title={selectedFile?.name}>
                                    {selectedFile?.name}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-txt-primary dark:text-dark-txt-primary mb-1">Taille</dt>
                                <dd className="font-medium text-txt-secondary dark:text-dark-txt-secondary">
                                    {convertFileSize(selectedFile?.size_bytes)}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-txt-primary dark:text-dark-txt-primary mb-1">Type MIME</dt>
                                <dd className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    {selectedFile?.mime_type || 'Inconnu'}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-txt-primary dark:text-dark-txt-primary mb-1">Dernière modification</dt>
                                <dd className="font-medium text-txt-secondary dark:text-dark-txt-secondary">
                                    {selectedFile ? formatDate(selectedFile.updatedAt) : ''}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </Modal>

            <UpdateFileModal
                isOpen={openUpdateModal}
                fileInfo={editFileInfo!}
                closeModal={() => closeUploadFileModal()}
            />

            <ShareFileModal
                isOpen={openShareModal}
                fileInfo={shareFileInfo!}
                closeModal={() => closeShareFileModal()}
            />

            <DeleteFileModal
                isOpen={openDeleteModal}
                fileInfo={deleteFileInfo!}
                closeModal={() => closeDeleteFileModal()}
            />

            <RenameFolderModal
                isOpen={openRenameFolderModal}
                folderInfo={renameFolderInfo!}
                closeModal={closeRenameFolderModal}
            />

            <DeleteFolderModal
                isOpen={openDeleteFolderModal}
                folderInfo={deleteFolderInfo!}
                closeModal={closeDeleteFolderModal}
            />
        </>
    );
}
