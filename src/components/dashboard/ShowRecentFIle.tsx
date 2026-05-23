"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FileResponse } from "@/src/interface/file";
import { getRecentFilesAPI, downloadFile } from "@/src/api/file";
import { getFileColor } from "@/src/utils/get-file-color";
import { getFileSvg } from "@/src/utils/get-file-svg";
import { convertFileSize } from "@/src/utils/convert-file-size";
import { converCreatedAt } from "@/src/utils/conver-created-at";
import { useSocketEvent } from "@/src/hooks/useSocketEvent";
import FileDetailsModal from "@/src/components/modal/FileDetailsModal";
import { useJwtInformation } from "@/src/hooks/getJwtInformation";

export default function ShowRecentFile() {
    const userInfo = useJwtInformation();
    const [files, setFiles] = useState<FileResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedFile, setSelectedFile] = useState<FileResponse | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileLoading, setFileLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const load = useCallback(() => {
        getRecentFilesAPI()
            .then(setFiles)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    useSocketEvent('file:created', useCallback(() => { load(); }, [load]));
    useSocketEvent('file:updated', useCallback(() => { load(); }, [load]));
    useSocketEvent('file:trashed', useCallback(() => { load(); }, [load]));
    useSocketEvent('file:deleted', useCallback(() => { load(); }, [load]));

    function openPreview(f: FileResponse) {
        setSelectedFile(f);
        setFile(null);
        setOpen(true);
        if (f.mime_type.startsWith('video/') || f.mime_type.startsWith('audio/')) {
            setFileLoading(false);
            return;
        }
        setFileLoading(true);
        downloadFile({ fileId: f.id, mimeType: f.mime_type })
            .then(blob => { setFile(blob); setFileLoading(false); })
            .catch(() => setFileLoading(false));
    }

    function closePreview() {
        setOpen(false);
        setSelectedFile(null);
        setFile(null);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <svg className="w-6 h-6 animate-spin text-[#444]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <p className="text-sm text-[#444] py-6 text-center">
                Aucun fichier récent.
            </p>
        );
    }

    return (
        <>
            <div className="flex flex-col divide-y divide-white/[0.04]">
                {files.map((f) => {
                    const color = getFileColor(f.mime_type);
                    return (
                        <button
                            key={f.id}
                            onClick={() => openPreview(f)}
                            className="flex items-center gap-3 py-3 px-2 rounded-[8px] hover:bg-white/[0.03] transition-colors text-left w-full"
                        >
                            <div
                                className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${color}18` }}
                            >
                                <img src={getFileSvg(f.mime_type)} alt={f.mime_type} className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#ccc] truncate" title={f.fullName}>
                                    {f.fullName}
                                </p>
                                <p className="text-xs text-[#555]">
                                    {convertFileSize(f.size_bytes)} · {converCreatedAt(f.updatedAt)}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            <FileDetailsModal
                isOpen={open}
                selectedFile={selectedFile}
                file={file}
                fileLoading={fileLoading}
                currentUserId={userInfo?.id ?? ""}
                onClose={closePreview}
            />
        </>
    );
}
