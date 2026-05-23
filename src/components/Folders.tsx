'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FolderResponse } from '@/src/interface/folder';
import { FileResponse } from "@/src/interface/file";
import { useJwtInformation } from "@/src/hooks/getJwtInformation";

import FileCard from "@/src/components/card/FileCard";
import { downloadFile, getFileThumbnail, moveFileIntoFolder, copyFileById } from '@/src/api/file';
import FolderCard from "@/src/components/card/FolderCard";
import { convertFileSize } from "@/src/utils/convert-file-size";
import UpdateFileModal from "@/src/components/modal/UpdateFile";
import ShareFileModal from "@/src/components/modal/ShareFile";
import MoveFileModal from '@/src/components/modal/MoveFile';
import { getFileColor } from "@/src/utils/get-file-color";
import { getFileSvg } from "@/src/utils/get-file-svg";
import DeleteFileModal from "@/src/components/modal/DeleteFile";
import DeleteFolderModal from "@/src/components/modal/DeleteFolder";
import RenameFolderModal from "@/src/components/modal/RenameFolder";
import FolderDetailsModal from "@/src/components/modal/FolderDetailsModal";
import MoveFolderModal from "@/src/components/modal/MoveFolderModal";
import { moveFolderIntoFolder, copyFolderById } from '@/src/api/folders';
import { downloadFileService } from "@/src/services/downloadFile";
import { downloadFolderService } from '../services/downloadFolder';
import FileDetailsModal from "@/src/components/modal/FileDetailsModal";
import { DropdownMenu } from "@/src/components/ui/DropdownMenu";

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

export default function Folders({ listFolders, listFiles, changeFolderId, viewMode = 'grid', onFolderRenamed, onFileChanged, contextPermission, isTrash, restoreFolder, restoreFile }: FoldersProps) {
    const userInfo = useJwtInformation();
    const fp = (item: FolderResponse | FileResponse) => item.permission ?? contextPermission ?? null;

    const [open, setOpen] = useState(false);
    const [openListMenuId, setOpenListMenuId] = useState<string | null>(null);
    const [thumbnails, setThumbnails] = useState<Record<number, string>>({});
    const [hoveredFolderId, setHoveredFolderId] = useState<number | null>(null);
    const listMenuRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const listMenuAnchorRef = useRef<{ current: HTMLButtonElement | null }>({ current: null });

    useEffect(() => {
        if (!listFiles) return;
        const imageFiles = listFiles.filter(f => f.mime_type.startsWith('image/'));
        if (imageFiles.length === 0) return;
        const objectUrls: string[] = [];
        imageFiles.forEach(f => {
            getFileThumbnail(f.id, 'small').then(blob => {
                const url = URL.createObjectURL(blob);
                objectUrls.push(url);
                setThumbnails(prev => ({ ...prev, [f.id]: url }));
            }).catch(() => {});
        });
        return () => { objectUrls.forEach(u => URL.revokeObjectURL(u)); };
    }, [listFiles]);

    useEffect(() => {
        if (openListMenuId === null) return;
        function handleClickOutside() { setOpenListMenuId(null); }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openListMenuId]);

    const [selectedFile, setSelectedFile] = useState<FileResponse | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileLoading, setFileLoading] = useState(false);

    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [editFileInfo, setEditFileInfo] = useState<FileResponse | null>(null);

    const [openShareModal, setOpenShareModal] = useState(false);
    const [shareFileInfo, setShareFileInfo] = useState<FileResponse | null>(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteFileInfo, setDeleteFileInfo] = useState<FileResponse | null>(null);

    const [openRenameFolderModal, setOpenRenameFolderModal] = useState(false);
    const [renameFolderInfo, setRenameFolderInfo] = useState<FolderResponse | null>(null);

    const [openMoveFolderModal, setOpenMoveFolderModal] = useState(false);
    const [moveFolderInfo, setMoveFolderInfo] = useState<FolderResponse | null>(null);

    const [openDeleteFolderModal, setOpenDeleteFolderModal] = useState(false);
    const [deleteFolderInfo, setDeleteFolderInfo] = useState<FolderResponse | null>(null);

    const [openFolderDetailsModal, setOpenFolderDetailsModal] = useState(false);
    const [folderDetailsInfo, setFolderDetailsInfo] = useState<FolderResponse | null>(null);

    const [openShareFolderModal, setOpenShareFolderModal] = useState(false);
    const [shareFolderInfo, setShareFolderInfo] = useState<FolderResponse | null>(null);

    const [openMoveModal, setOpenMoveModal] = useState(false);
    const [editFilePositionInfo, setPositionFileInfo] = useState<FileResponse | null>(null);

    function setFileInformationAndOpen(file: FileResponse) {
        setSelectedFile(file);
        setFile(null);
        setOpen(true);
        if (file.mime_type.startsWith('video/') || file.mime_type.startsWith('audio/')) { setFileLoading(false); return; }
        setFileLoading(true);
        downloadFile({ fileId: file.id, mimeType: file.mime_type }).then(f => { setFile(f); setFileLoading(false); });
    }

    function setFileInformationAndClose() { setOpen(false); setSelectedFile(null); setFile(null); }

    async function downloadFileById(fileId: number | null, fileName: string) { await downloadFileService(fileId, fileName); }
    async function downloadFolderById(folderId: number | null, folderName: string) { await downloadFolderService(folderId, folderName); }

    async function handleDrop(e: React.DragEvent, targetFolderId: number) {
        e.preventDefault();
        setHoveredFolderId(null);
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json')) as { type: 'file' | 'folder'; id: number };
            if (data.type === 'file') { await moveFileIntoFolder(data.id, targetFolderId.toString()); onFileChanged?.(); }
            else if (data.type === 'folder' && data.id !== targetFolderId) { await moveFolderIntoFolder(data.id, targetFolderId.toString()); onFolderRenamed?.(); }
        } catch {}
    }

    const folderColor = "#F59E0B";

    const isEmpty = listFolders.length === 0 && (!listFiles || listFiles.length === 0);

    return (
        <>
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-[#333]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                        </svg>
                    </div>
                    <p className="text-[#444] text-sm">Ce dossier est vide</p>
                    <p className="text-[#333] text-xs mt-1">Importez des fichiers ou créez un dossier</p>
                </div>
            ) : viewMode === 'grid' ? (
                /* ─── GRID VIEW ─── */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {listFolders.map((folder) => (
                        <div
                            key={folder.id}
                            className={`bg-surface dark:bg-[#111113] border rounded-[12px] overflow-hidden hover:border-[#7c6ef8]/20 transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-none ${
                                hoveredFolderId === folder.id ? 'border-[#7c6ef8]/60' : 'border-border-subtle dark:border-white/[0.06]'
                            }`}
                            onClick={() => changeFolderId(folder.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={(e) => { e.preventDefault(); setHoveredFolderId(folder.id); }}
                            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHoveredFolderId(null); }}
                            onDrop={(e) => handleDrop(e, folder.id)}
                        >
                            <FolderCard
                                folder={folder}
                                isTrash={isTrash}
                                isDropTarget={hoveredFolderId === folder.id}
                                downloadFolder={downloadFolderById}
                                restoreFolder={isTrash ? restoreFolder : undefined}
                                renameFolder={!fp(folder) ? (f) => { setRenameFolderInfo(f); setOpenRenameFolderModal(true); } : undefined}
                                deleteFolder={!fp(folder) || isTrash ? (f) => { setDeleteFolderInfo(f); setOpenDeleteFolderModal(true); } : undefined}
                                openShares={!fp(folder) ? (f) => { setFolderDetailsInfo(f); setOpenFolderDetailsModal(true); } : undefined}
                                shareFolder={!fp(folder) ? (f) => { setShareFolderInfo(f); setOpenShareFolderModal(true); } : undefined}
                                moveFolder={!fp(folder) || fp(folder) === 'WRITE' ? (f) => { setMoveFolderInfo(f); setOpenMoveFolderModal(true); } : undefined}
                                copyFolder={!fp(folder) || fp(folder) === 'WRITE' ? async (f) => { try { await copyFolderById(f.id); onFolderRenamed?.(); } catch (e: any) { alert(e.message); } } : undefined}
                            />
                        </div>
                    ))}
                    {listFiles && listFiles.map((file) => (
                        <div
                            key={file.id}
                            className="bg-surface dark:bg-[#111113] border border-border-subtle dark:border-white/[0.06] rounded-[12px] overflow-hidden hover:border-[#7c6ef8]/20 transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-none"
                            onClick={() => setFileInformationAndOpen(file)}
                        >
                            <FileCard
                                file={file}
                                thumbnailUrl={thumbnails[file.id]}
                                isTrash={isTrash}
                                restoreFile={!fp(file) || isTrash ? restoreFile : undefined}
                                downloadFile={!isTrash ? downloadFileById : undefined}
                                editFile={!fp(file) || fp(file) === 'WRITE' ? (f) => { setEditFileInfo(f); setOpenUpdateModal(true); return Promise.resolve(); } : undefined}
                                shareFile={!fp(file) ? (f) => { setShareFileInfo(f); setOpenShareModal(true); return Promise.resolve(); } : undefined}
                                moveFile={!fp(file) || fp(file) === 'WRITE' ? (f) => { setPositionFileInfo(f); setOpenMoveModal(true); return Promise.resolve(); } : undefined}
                                deleteFile={!fp(file) || isTrash ? (f) => { setDeleteFileInfo(f); setOpenDeleteModal(true); } : undefined}
                                copyFile={!fp(file) || fp(file) === 'WRITE' ? async (f) => { try { await copyFileById(f.id); onFileChanged?.(); } catch (e: any) { alert(e.message); } } : undefined}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                /* ─── LIST VIEW ─── */
                <div className="flex flex-col">
                    {/* List header */}
                    <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-2 mb-1">
                        <div className="w-9" />
                        <span className="text-[11px] font-semibold text-[#9CA3AF] dark:text-[#333] uppercase tracking-wider">Nom</span>
                        <span className="text-[11px] font-semibold text-[#9CA3AF] dark:text-[#333] uppercase tracking-wider w-20 text-right">Taille</span>
                        <span className="text-[11px] font-semibold text-[#9CA3AF] dark:text-[#333] uppercase tracking-wider w-32 text-right">Modifié</span>
                        <div className="w-8" />
                    </div>

                    <div className="flex flex-col divide-y divide-border-subtle dark:divide-white/[0.04]">
                        {listFolders.map((folder) => (
                            <div
                                key={folder.id}
                                className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-4 py-2.5 rounded-[8px] transition-colors ${
                                    hoveredFolderId === folder.id ? 'bg-[#7c6ef8]/10' : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.02]'
                                }`}
                                draggable={true}
                                onDragStart={(e) => { e.dataTransfer.setData('application/json', JSON.stringify({ type: 'folder', id: folder.id })); e.dataTransfer.effectAllowed = 'move'; }}
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnter={(e) => { e.preventDefault(); setHoveredFolderId(folder.id); }}
                                onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHoveredFolderId(null); }}
                                onDrop={(e) => handleDrop(e, folder.id)}
                            >
                                <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F59E0B18', color: folderColor }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                                    </svg>
                                </div>
                                <button className="text-left min-w-0" onClick={() => !isTrash && changeFolderId(folder.id)}>
                                    <span className="text-sm font-medium text-txt-primary dark:text-[#ccc] truncate block">{folder.name}</span>
                                    <span className="text-xs text-txt-secondary dark:text-[#444]">Dossier</span>
                                </button>
                                <span className="text-xs text-txt-secondary dark:text-[#444] w-20 text-right">—</span>
                                <span className="text-xs text-txt-secondary dark:text-[#444] w-32 text-right">{folder.created_at ? new Date(folder.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                                <div className="relative w-8 flex-shrink-0" onMouseDown={e => e.stopPropagation()}>
                                    <button
                                        ref={(el) => { if (el) listMenuRefs.current.set(`folder-${folder.id}`, el); else listMenuRefs.current.delete(`folder-${folder.id}`); }}
                                        onClick={(e) => { e.stopPropagation(); const key = `folder-${folder.id}`; listMenuAnchorRef.current.current = listMenuRefs.current.get(key) ?? null; setOpenListMenuId(openListMenuId === key ? null : key); }}
                                        className="w-8 h-8 flex items-center justify-center rounded-[6px] text-txt-secondary dark:text-[#444] hover:text-txt-primary dark:hover:text-[#ededed] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg>
                                    </button>
                                    {openListMenuId === `folder-${folder.id}` && (
                                        <DropdownMenu
                                            onClose={() => setOpenListMenuId(null)}
                                            anchorRef={listMenuAnchorRef.current}
                                            items={[
                                                ...(isTrash && restoreFolder ? [{ label: 'Restaurer', success: true, onClick: () => restoreFolder(folder) }] : []),
                                                { label: 'Télécharger', onClick: () => downloadFolderById(folder.id, folder.name) },
                                                ...(!fp(folder) ? [{ label: "Droits d'accès", onClick: () => { setFolderDetailsInfo(folder); setOpenFolderDetailsModal(true); } }] : []),
                                                ...(!fp(folder) ? [{ label: 'Partager', onClick: () => { setShareFolderInfo(folder); setOpenShareFolderModal(true); } }] : []),
                                                ...(!fp(folder) ? [{ label: 'Renommer', onClick: () => { setRenameFolderInfo(folder); setOpenRenameFolderModal(true); } }] : []),
                                                ...(!fp(folder) || fp(folder) === 'WRITE' ? [{ label: 'Déplacer', onClick: () => { setMoveFolderInfo(folder); setOpenMoveFolderModal(true); } }] : []),
                                                ...(!fp(folder) || isTrash ? [{ label: 'Supprimer', danger: true, onClick: () => { setDeleteFolderInfo(folder); setOpenDeleteFolderModal(true); } }] : []),
                                            ]}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}

                        {listFiles && listFiles.map((file) => {
                            const color = getFileColor(file.mime_type);
                            return (
                                <div
                                    key={file.id}
                                    className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-4 py-2.5 rounded-[8px] hover:bg-black/[0.03] dark:hover:bg-white/[0.02] transition-colors cursor-grab active:cursor-grabbing"
                                    draggable={true}
                                    onDragStart={(e) => { e.dataTransfer.setData('application/json', JSON.stringify({ type: 'file', id: file.id })); e.dataTransfer.effectAllowed = 'move'; }}
                                >
                                    <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor: `${color}18` }}>
                                        {thumbnails[file.id] ? (
                                            <img src={thumbnails[file.id]} alt={file.name} className="w-full h-full object-cover rounded-[8px]" />
                                        ) : (
                                            <img src={getFileSvg(file.mime_type)} alt="File Icon" className="w-5 h-5" />
                                        )}
                                    </div>
                                    <button className="text-left min-w-0" onClick={() => setFileInformationAndOpen(file)}>
                                        <span className="text-sm font-medium text-txt-primary dark:text-[#ccc] truncate block">{file.fullName}</span>
                                        <span className="text-xs text-txt-secondary dark:text-[#444]">{file.mime_type}</span>
                                    </button>
                                    <span className="text-xs text-txt-secondary dark:text-[#444] w-20 text-right">{convertFileSize(file.size_bytes)}</span>
                                    <span className="text-xs text-txt-secondary dark:text-[#444] w-32 text-right">{new Date(file.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    <div className="relative w-8 flex-shrink-0" onMouseDown={e => e.stopPropagation()}>
                                        <button
                                            ref={(el) => { if (el) listMenuRefs.current.set(`file-${file.id}`, el); else listMenuRefs.current.delete(`file-${file.id}`); }}
                                            onClick={(e) => { e.stopPropagation(); const key = `file-${file.id}`; listMenuAnchorRef.current.current = listMenuRefs.current.get(key) ?? null; setOpenListMenuId(openListMenuId === key ? null : key); }}
                                            className="w-8 h-8 flex items-center justify-center rounded-[6px] text-txt-secondary dark:text-[#444] hover:text-txt-primary dark:hover:text-[#ededed] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                            </svg>
                                        </button>
                                        {openListMenuId === `file-${file.id}` && (
                                            <DropdownMenu
                                                onClose={() => setOpenListMenuId(null)}
                                                anchorRef={listMenuAnchorRef.current}
                                                items={[
                                                    ...(isTrash && restoreFile ? [{ label: 'Restaurer', success: true, onClick: () => restoreFile(file) }] : []),
                                                    ...(!isTrash ? [{ label: 'Télécharger', onClick: () => downloadFileById(file.id, file.fullName) }] : []),
                                                    ...(!fp(file) || fp(file) === 'WRITE' ? [{ label: 'Renommer', onClick: () => { setEditFileInfo(file); setOpenUpdateModal(true); } }] : []),
                                                    ...(!fp(file) ? [{ label: 'Partager', onClick: () => { setShareFileInfo(file); setOpenShareModal(true); } }] : []),
                                                    ...(!fp(file) || fp(file) === 'WRITE' ? [{ label: 'Déplacer', onClick: () => { setPositionFileInfo(file); setOpenMoveModal(true); } }] : []),
                                                    ...(!fp(file) || isTrash ? [{ label: 'Supprimer', danger: true, onClick: () => { setDeleteFileInfo(file); setOpenDeleteModal(true); } }] : []),
                                                ]}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <FileDetailsModal isOpen={open} selectedFile={selectedFile} file={file} fileLoading={fileLoading} currentUserId={userInfo?.id ?? ""} onClose={setFileInformationAndClose} />
            <UpdateFileModal isOpen={openUpdateModal} fileInfo={editFileInfo!} closeModal={() => { setEditFileInfo(null); setOpenUpdateModal(false); }} onSuccess={onFileChanged} />
            <ShareFileModal isOpen={openShareModal} fileInfo={shareFileInfo!} closeModal={() => { setShareFileInfo(null); setOpenShareModal(false); }} />
            <MoveFileModal isOpen={openMoveModal} fileInfo={editFilePositionInfo!} closeModal={() => { setPositionFileInfo(null); setOpenMoveModal(false); }} />
            <DeleteFileModal isOpen={openDeleteModal} fileInfo={deleteFileInfo!} closeModal={() => { setDeleteFileInfo(null); setOpenDeleteModal(false); }} onSuccess={onFileChanged} isTrash={isTrash} />
            <RenameFolderModal isOpen={openRenameFolderModal} folderInfo={renameFolderInfo!} closeModal={() => { setRenameFolderInfo(null); setOpenRenameFolderModal(false); }} onSuccess={onFolderRenamed} />
            <DeleteFolderModal isOpen={openDeleteFolderModal} folderInfo={deleteFolderInfo!} closeModal={() => { setDeleteFolderInfo(null); setOpenDeleteFolderModal(false); }} />
            <MoveFolderModal isOpen={openMoveFolderModal} folderInfo={moveFolderInfo!} closeModal={() => { setMoveFolderInfo(null); setOpenMoveFolderModal(false); }} />
            <FolderDetailsModal isOpen={openFolderDetailsModal} folder={folderDetailsInfo} onClose={() => { setFolderDetailsInfo(null); setOpenFolderDetailsModal(false); }} />
            <ShareFileModal isOpen={openShareFolderModal} folderInfo={shareFolderInfo!} closeModal={() => { setShareFolderInfo(null); setOpenShareFolderModal(false); }} />
        </>
    );
}
