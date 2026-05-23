'use client';

import React, { useRef, useState } from 'react';
import { FolderResponse } from "@/src/interface/folder";
import { converCreatedAt } from "@/src/utils/conver-created-at";
import { DropdownMenu, MenuItem } from "@/src/components/ui/DropdownMenu";

interface FolderCardProps {
    folder: FolderResponse;
    downloadFolder?: (folderId: number, folderName: string) => Promise<void>;
    renameFolder?: (folder: FolderResponse) => void;
    deleteFolder?: (folder: FolderResponse) => void;
    openShares?: (folder: FolderResponse) => void;
    shareFolder?: (folder: FolderResponse) => void;
    copyFolder?: (folder: FolderResponse) => void;
    isTrash?: boolean;
    restoreFolder?: (folder: FolderResponse) => void;
    moveFolder?: (folder: FolderResponse) => void;
    isDropTarget?: boolean;
}

export default function FolderCard({
    folder, downloadFolder, renameFolder, deleteFolder, openShares,
    shareFolder, moveFolder, copyFolder, isTrash, restoreFolder, isDropTarget,
}: FolderCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);

    const menuItems: MenuItem[] = [
        ...(isTrash && restoreFolder ? [{ label: 'Restaurer', success: true, onClick: () => restoreFolder(folder) }] : []),
        ...(downloadFolder ? [{ label: 'Télécharger', onClick: () => downloadFolder(folder.id, folder.name) }] : []),
        ...(openShares ? [{ label: "Droits d'accès", onClick: () => openShares(folder) }] : []),
        ...(shareFolder ? [{ label: 'Partager', onClick: () => shareFolder(folder) }] : []),
        ...(renameFolder ? [{ label: 'Renommer', onClick: () => renameFolder(folder) }] : []),
        ...(moveFolder ? [{ label: 'Déplacer', onClick: () => moveFolder(folder) }] : []),
        ...(copyFolder ? [{ label: 'Dupliquer', onClick: () => copyFolder(folder) }] : []),
        ...(deleteFolder ? [{ label: 'Supprimer', danger: true, onClick: () => deleteFolder(folder) }] : []),
    ];

    return (
        <div
            className={`relative flex flex-col cursor-grab active:cursor-grabbing ${isDropTarget ? 'ring-2 ring-[#7c6ef8]/60' : ''}`}
            draggable={true}
            onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify({ type: 'folder', id: folder.id }));
                e.dataTransfer.effectAllowed = 'move';
            }}
        >
            {/* Icon area */}
            <div className="h-[90px] bg-surface-hover dark:bg-[#0d0d0d] flex items-center justify-center relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#F59E0B18', color: '#F59E0B' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                    </svg>
                </div>
            </div>

            {menuItems.length > 0 && (
                <div className="absolute top-2 right-2 z-40">
                    <button
                        ref={btnRef}
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
                        className="w-7 h-7 flex items-center justify-center rounded-[6px] text-txt-secondary dark:text-[#444] hover:text-txt-primary dark:hover:text-[#ededed] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                    </button>
                    {menuOpen && <DropdownMenu items={menuItems} onClose={() => setMenuOpen(false)} anchorRef={btnRef} />}
                </div>
            )}

            {/* Info area */}
            <div className="px-3 py-2.5">
                <p className="text-[13px] font-medium text-txt-primary dark:text-[#ccc] truncate" title={folder.name}>{folder.name}</p>
                <p className="text-[11px] text-txt-secondary dark:text-[#444] mt-0.5">Dossier</p>
            </div>
        </div>
    );
}
