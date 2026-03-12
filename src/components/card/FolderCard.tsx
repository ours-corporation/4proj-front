import React, { useState, useRef, useEffect } from 'react';
import { FolderResponse } from "@/src/interface/folder";
import { converCreatedAt } from "@/src/utils/conver-created-at";

interface FolderCardProps {
    folder: FolderResponse;
    renameFolder?: (folder: FolderResponse) => void;
    deleteFolder?: (folder: FolderResponse) => void;
    openShares?: (folder: FolderResponse) => void;
    shareFolder?: (folder: FolderResponse) => void;

    isTrash?: boolean;
    restoreFolder?: (folder: FolderResponse) => void;
    emptyTrash?: () => void;
}

export default function FolderCard({ folder, renameFolder, deleteFolder, openShares, shareFolder, isTrash, restoreFolder }: FolderCardProps) {
    const folderColor = "#F59E0B";
    const folderBgColor = "#F59E0B20";
    const hasActions = !!(renameFolder || deleteFolder || openShares || shareFolder || (isTrash && restoreFolder));
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative flex flex-col justify-center items-start cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-full flex flex-row justify-between items-start">
                <div
                    className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-3"
                    style={{
                        backgroundColor: folderBgColor,
                        color: folderColor,
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-10 h-10"
                    >
                        <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                    </svg>
                </div>

                {hasActions && (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(!open);
                            }}
                            className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-10"
                        >
                            ⋯
                        </button>

                        {open && (
                            <div className="absolute right-0 w-40 bg-main-bg dark:bg-dark-main-bg rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                {isTrash && restoreFolder && (
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            restoreFolder(folder);
                                            setOpen(false);
                                        }}
                                    >
                                        Restaurer
                                    </button>
                                )}
                                
                                {openShares && (
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openShares(folder);
                                            setOpen(false);
                                        }}
                                    >
                                        Droits d&apos;accès
                                    </button>
                                )}
                                {shareFolder && (
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            shareFolder(folder);
                                            setOpen(false);
                                        }}
                                    >
                                        Partager
                                    </button>
                                )}
                                {renameFolder && (
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            renameFolder(folder);
                                            setOpen(false);
                                        }}
                                    >
                                        Renommer
                                    </button>
                                )}
                                {deleteFolder && (
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteFolder(folder);
                                            setOpen(false);
                                        }}
                                    >
                                        Supprimer
                                    </button>
                                )}
                                
                            </div>
                        )}
                    </div>
                )}
            </div>

            <h2
                className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate w-full flex items-start justify-start"
                title={folder.name}
            >
                {folder.name}
            </h2>

            <div
                className="w-full flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                <span>Dossier</span>
            </div>
        </div>
    );
}
