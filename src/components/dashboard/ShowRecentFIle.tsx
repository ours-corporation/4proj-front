"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FileResponse } from "@/src/interface/file";
import { getRecentFilesAPI } from "@/src/api/file";
import { getFileColor } from "@/src/utils/get-file-color";
import { getFileSvg } from "@/src/utils/get-file-svg";
import { convertFileSize } from "@/src/utils/convert-file-size";
import { converCreatedAt } from "@/src/utils/conver-created-at";

export default function ShowRecentFile() {
    const [files, setFiles] = useState<FileResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRecentFilesAPI()
            .then(setFiles)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

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
        <div className="flex flex-col divide-y divide-white/[0.04]">
            {files.map((file) => {
                const color = getFileColor(file.mime_type);
                const href = file.folder_id ? `/folders?folderId=${file.folder_id}` : "/folders";
                return (
                    <Link
                        key={file.id}
                        href={href}
                        className="flex items-center gap-3 py-3 px-2 rounded-[8px] hover:bg-white/[0.03] transition-colors no-underline"
                    >
                        <div
                            className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${color}18` }}
                        >
                            <img src={getFileSvg(file.mime_type)} alt={file.mime_type} className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#ccc] truncate" title={file.fullName}>
                                {file.fullName}
                            </p>
                            <p className="text-xs text-[#555]">
                                {convertFileSize(file.size_bytes)} · {converCreatedAt(file.updatedAt)}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
