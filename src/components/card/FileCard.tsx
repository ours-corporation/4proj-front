'use client';

import React, { useRef, useState } from "react";
import { FileResponse } from "@/src/interface/file";
import { getFileColor } from "@/src/utils/get-file-color";
import { getFileSvg } from "@/src/utils/get-file-svg";
import { convertFileSize } from "@/src/utils/convert-file-size";
import { converCreatedAt } from "@/src/utils/conver-created-at";
import { DropdownMenu, MenuItem } from "@/src/components/ui/DropdownMenu";

interface FileProps {
    file: FileResponse;
    thumbnailUrl?: string;
    downloadFile?: (fileId: number, fileName: string) => Promise<void>;
    editFile?: (file: FileResponse) => Promise<void>;
    shareFile?: (file: FileResponse) => Promise<void>;
    moveFile?: (file: FileResponse) => Promise<void>;
    copyFile?: (file: FileResponse) => Promise<void>;
    deleteFile?: (file: FileResponse) => void;
    isTrash?: boolean;
    restoreFile?: (file: FileResponse) => void;
}

export default function FileCard({ file, thumbnailUrl, downloadFile, editFile, shareFile, moveFile, deleteFile, copyFile, isTrash, restoreFile }: FileProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const color = getFileColor(file.mime_type);

    const menuItems: MenuItem[] = [
        ...(isTrash && restoreFile ? [{ label: 'Restaurer', success: true, onClick: () => restoreFile(file) }] : []),
        ...(downloadFile ? [{ label: 'Télécharger', onClick: () => downloadFile(file.id, file.fullName) }] : []),
        ...(editFile ? [{ label: 'Renommer', onClick: () => editFile(file) }] : []),
        ...(shareFile ? [{ label: 'Partager', onClick: () => shareFile(file) }] : []),
        ...(moveFile ? [{ label: 'Déplacer', onClick: () => moveFile(file) }] : []),
        ...(copyFile ? [{ label: 'Dupliquer', onClick: () => copyFile(file) }] : []),
        ...(deleteFile ? [{ label: 'Supprimer', danger: true, onClick: () => deleteFile(file) }] : []),
    ];

    return (
        <div
            className="relative flex flex-col cursor-grab active:cursor-grabbing"
            draggable={true}
            onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify({ type: 'file', id: file.id }));
                e.dataTransfer.effectAllowed = 'move';
            }}
        >
            {/* Thumbnail / Icon area */}
            <div className="h-[90px] bg-surface-hover dark:bg-[#0d0d0d] flex items-center justify-center relative overflow-hidden">
                {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                        <img src={getFileSvg(file.mime_type)} alt="File Icon" className="w-8 h-8" />
                    </div>
                )}
            </div>

            {menuItems.length > 0 && (
                <div className="absolute top-2 right-2 z-40">
                    <button
                        ref={btnRef}
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
                        className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#6B7280] hover:text-txt-primary dark:text-[#666] dark:hover:text-[#ededed] hover:bg-black/[0.15] dark:hover:bg-black/40 transition-colors"
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
                <p className="text-[13px] font-medium text-txt-primary dark:text-[#ccc] truncate" title={file.fullName}>{file.fullName}</p>
                <p className="text-[11px] text-txt-secondary dark:text-[#444] mt-0.5">{convertFileSize(file.size_bytes)} · {converCreatedAt(file.createdAt)}</p>
            </div>
        </div>
    );
}
