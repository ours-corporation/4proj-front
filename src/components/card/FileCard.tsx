import React, { useState, useRef, useEffect } from "react";
import { FileResponse } from "@/src/interface/file";

import { getFileColor } from "@/src/utils/get-file-color";
import { getFileSvg } from "@/src/utils/get-file-svg";
import { convertFileSize } from "@/src/utils/convert-file-size";
import { converCreatedAt } from "@/src/utils/conver-created-at";

interface FileProps {
    file: FileResponse;
    downloadFile?: (fileId: number, fileName: string) => Promise<void>;
    editFile?: (file: FileResponse) => Promise<void>;
    shareFile?: (file: FileResponse) => Promise<void>;
    deleteFile?: (fileId: number) => void;
}

export default function FileCard({ file, downloadFile, editFile, shareFile, deleteFile }: FileProps) {
    const hasActions = !!(downloadFile || editFile || shareFile || deleteFile);
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
        <div className="relative flex flex-col justify-center items-start">
            <div className="w-full flex flex-row justify-between items-start">
                <div
                    className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-3"
                    style={{
                        backgroundColor: `${getFileColor(file.mime_type)}20`,
                        color: getFileColor(file.mime_type),
                    }}
                >
                    <img
                        src={getFileSvg(file.mime_type)}
                        alt="File Icon"
                        className="w-10 h-10"
                    />
                </div>

                {/* Burger des actions */}
                <div className="relative" ref={menuRef}>
                    {hasActions && (
                        <>
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
                                    {downloadFile && (
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                downloadFile(file.id, file.name);
                                                setOpen(false);
                                            }}
                                        >
                                            Télécharger
                                        </button>
                                    )}
                                    {editFile && (
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                editFile(file);
                                                setOpen(false);
                                            }}
                                        >
                                            Renommer
                                        </button>
                                    )}
                                    {shareFile && (
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                shareFile(file);
                                                setOpen(false);
                                            }}
                                        >
                                            Partager
                                        </button>
                                    )}
                                    {deleteFile && (
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            onClick={() => {
                                                deleteFile(file.id);
                                                setOpen(false);
                                            }}
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <h2
                className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate w-full flex items-start justify-start"
                title={file.fullName}
            >
                {file.fullName}
            </h2>

            <div className="w-full flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                <span>{convertFileSize(file.size_bytes)}</span>
                <span>{converCreatedAt(file.createdAt)}</span>
            </div>
        </div>
    );
}