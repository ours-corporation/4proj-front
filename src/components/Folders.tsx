import React, {useState, useEffect} from 'react';

import { FolderResponse } from '@/src/interface/folder';
import {FileResponse} from "@/src/interface/file";
import {useJwtInformation} from "@/src/hooks/getJwtInformation";


import FileCard from "@/src/components/card/FileCard";
import { downloadFile, getFileThumbnail } from '@/src/api/file';
import FolderCard from "@/src/components/card/FolderCard";
import {convertFileSize} from "@/src/utils/convert-file-size";
import UpdateFileModal from "@/src/components/modal/UpdateFile";
import ShareFileModal from "@/src/components/modal/ShareFile";
import MoveFileModal from '@/src/components/modal/MoveFile';
import {getFileColor} from "@/src/utils/get-file-color";
import {getFileSvg} from "@/src/utils/get-file-svg";
import DeleteFileModal from "@/src/components/modal/DeleteFile";
import DeleteFolderModal from "@/src/components/modal/DeleteFolder";
import RenameFolderModal from "@/src/components/modal/RenameFolder";
import FolderDetailsModal from "@/src/components/modal/FolderDetailsModal";
import { downloadFileService } from "@/src/services/downloadFile";
import FileDetailsModal from "@/src/components/modal/FileDetailsModal";


interface FoldersProps {
    listFolders: FolderResponse[];
    listFiles?: FileResponse[];
    changeFolderId: (newFolderIdNumber: number | null) => Promise<void>;
    viewMode?: 'grid' | 'list';
    onFolderRenamed?: () => void;
    onFileChanged?: () => void;
    contextPermission?: 'READ' | 'WRITE' | null;

    isTrash?: boolean;                                   
    restoreFolder?: (folder: FolderResponse) => void;    
    restoreFile?: (folder: FileResponse) => void;   
}

export default function Folders({ listFolders, listFiles, changeFolderId, viewMode = 'grid', onFolderRenamed, onFileChanged, contextPermission, isTrash, restoreFolder, restoreFile}: FoldersProps) {
    const userInfo = useJwtInformation();

    // Permission effective : celle de l'item si définie, sinon celle héritée du contexte (dossier partagé parent)
    const fp = (item: FolderResponse | FileResponse) => item.permission ?? contextPermission ?? null;
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

    //Folder details (shares) modal
    const [ openFolderDetailsModal, setOpenFolderDetailsModal ] = useState<boolean>(false);
    const [ folderDetailsInfo, setFolderDetailsInfo ] = useState<FolderResponse | null>(null);

    //Share folder modal
    const [ openShareFolderModal, setOpenShareFolderModal ] = useState<boolean>(false);
    const [ shareFolderInfo, setShareFolderInfo ] = useState<FolderResponse | null>(null);


    //Move File modal
    const [ openMoveModal, setOpenMoveModal] = useState<boolean>(false);
    const [ editFilePositionInfo, setPositionFileInfo ] = useState<FileResponse | null>(null);

    function setFileInformationAndOpen(file: FileResponse) {
        setSelectedFile(file);
        setFile(null);
        setFileLoading(true);
        setOpen(true);
        const fileDownload = async () => {
            const downloadedFile = await downloadFile({ fileId: file.id });
            setFile(downloadedFile);
            setOpen(true);
            setFileLoading(false);
        }
        fileDownload();
    }

    function setFileInformationAndClose() {
        setOpen(false);
        setSelectedFile(null);
        setFile(null);
    }

    async function downloadFileById(fileId: number | null, fileName: string) {
        await downloadFileService(fileId, fileName);
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

    //Folder details (shares) modal
    function openFolderDetailsModalFn(folder: FolderResponse) {
        setFolderDetailsInfo(folder);
        setOpenFolderDetailsModal(true);
    }

    function closeFolderDetailsModal() {
        setFolderDetailsInfo(null);
        setOpenFolderDetailsModal(false);
    }

    //Share folder modal
    function openShareFolderModalFn(folder: FolderResponse) {
        setShareFolderInfo(folder);
        setOpenShareFolderModal(true);
    }

    function closeShareFolderModal() {
        setShareFolderInfo(null);
        setOpenShareFolderModal(false);
    }

    async function openMoveFileModal(file: FileResponse){
        if (!file) return;
        setPositionFileInfo(file);
        setOpenMoveModal(true);
    }

    async function closeMoveFileModal(){
        setPositionFileInfo(null);
        setOpenMoveModal(false);
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
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
                        isTrash={isTrash}                          
                        restoreFolder={isTrash ? restoreFolder : undefined} 
                        renameFolder={!fp(folder) || fp(folder) === 'WRITE' ? openRenameFolderModalFn : undefined}
                        deleteFolder={!fp(folder) || isTrash ? openDeleteFolderModalFn : undefined}
                        openShares={!fp(folder) ? openFolderDetailsModalFn : undefined}
                        shareFolder={!fp(folder) ? openShareFolderModalFn : undefined}
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
                    isTrash={isTrash}    
                    restoreFile={isTrash ? restoreFile : undefined} 
                    downloadFile={!fp(file) ? downloadFileById : undefined}
                    editFile={!fp(file) || fp(file) === 'WRITE' ? openUpdateFileModal : undefined}
                    shareFile={!fp(file) ? openShareFileModal : undefined}
                    moveFile={!fp(file) ? openMoveFileModal : undefined}
                    deleteFile={!fp(file) || isTrash ? openDeleteFileModal : undefined}
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
                    <button className="flex-1 text-left min-w-0 mr-3" onClick={() => !isTrash && changeFolderId(folder.id)}>
                        <span className="font-medium text-gray-900 dark:text-white truncate block">{folder.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Dossier</span>
                    </button>
                    <div className="relative flex-shrink-0" onMouseDown={e => e.stopPropagation()}>
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
                                {isTrash && restoreFolder && (
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                        onClick={(e) => { e.stopPropagation(); restoreFolder(folder); setOpenListMenuId(null); }}
                                    >
                                        Restaurer
                                    </button>
                                )}
                                
                                {!fp(folder) && (
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={(e) => { e.stopPropagation(); openFolderDetailsModalFn(folder); setOpenListMenuId(null); }}
                                    >
                                        Droits d&apos;accès
                                    </button>
                                )}
                                {!fp(folder) && (
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={(e) => { e.stopPropagation(); openShareFolderModalFn(folder); setOpenListMenuId(null); }}
                                    >
                                        Partager
                                    </button>
                                )}
                                {(!fp(folder) || fp(folder) === 'WRITE') && (
                                <button
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={(e) => { e.stopPropagation(); openRenameFolderModalFn(folder); setOpenListMenuId(null); }}
                                >
                                    Renommer
                                </button>
                                )}
                                {!fp(folder) || isTrash && (
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={(e) => { e.stopPropagation(); openDeleteFolderModalFn(folder); setOpenListMenuId(null); }}
                                >
                                    Supprimer
                                </button>
                                )}
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
                    <div className="relative flex-shrink-0" onMouseDown={e => e.stopPropagation()}>
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
                                {(!fp(file) || fp(file) === 'WRITE') && (
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={(e) => { e.stopPropagation(); openUpdateFileModal(file); setOpenListMenuId(null); }}
                                    >
                                        Renommer
                                    </button>
                                )}
                                {!fp(file) && (
                                    <>
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
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
        )}

            {/* Show details modal */}
            <FileDetailsModal
                isOpen={open}
                selectedFile={selectedFile}
                file={file}
                fileLoading={fileLoading}
                currentUserId={userInfo.id}
                onClose={() => setFileInformationAndClose()}
            />

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
            <MoveFileModal
                isOpen={openMoveModal}
                fileInfo={editFilePositionInfo!}
                closeModal={() => closeMoveFileModal()}
            />

            <DeleteFileModal
                isOpen={openDeleteModal}
                fileInfo={deleteFileInfo!}
                closeModal={() => closeDeleteFileModal()}
                onSuccess={onFileChanged}
            />

            <RenameFolderModal
                isOpen={openRenameFolderModal}
                folderInfo={renameFolderInfo!}
                closeModal={closeRenameFolderModal}
                onSuccess={onFolderRenamed}
            />

            <DeleteFolderModal
                isOpen={openDeleteFolderModal}
                folderInfo={deleteFolderInfo!}
                closeModal={closeDeleteFolderModal}
            />

            <FolderDetailsModal
                isOpen={openFolderDetailsModal}
                folder={folderDetailsInfo}
                onClose={closeFolderDetailsModal}
            />

            <ShareFileModal
                isOpen={openShareFolderModal}
                folderInfo={shareFolderInfo!}
                closeModal={closeShareFolderModal}
            />
        </>
    );
}
