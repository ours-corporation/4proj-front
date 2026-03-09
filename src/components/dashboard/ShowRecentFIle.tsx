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
            <div className="flex items-center justify-center py-10">
                <svg className="w-8 h-8 animate-spin text-txt-secondary dark:text-dark-txt-secondary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <p className="text-sm text-txt-secondary dark:text-dark-txt-secondary py-6 text-center">
                Aucun fichier récent.
            </p>
        );
    }

    return (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            {files.map((file) => {
                const color = getFileColor(file.mime_type);
                const href = file.folder_id ? `/folders?folderId=${file.folder_id}` : "/folders";
                return (
                    <Link
                        key={file.id}
                        href={href}
                        className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${color}20` }}
                        >
                            <img src={getFileSvg(file.mime_type)} alt={file.mime_type} className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-txt-primary dark:text-dark-txt-primary truncate" title={file.fullName}>
                                {file.fullName}
                            </p>
                            <p className="text-xs text-txt-secondary dark:text-dark-txt-secondary">
                                {convertFileSize(file.size_bytes)} · {converCreatedAt(file.updatedAt)}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
