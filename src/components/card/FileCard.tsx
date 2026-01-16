import React from 'react';

import {FileResponse} from "@/src/interface/file";

import { getFileColor } from "@/src/utils/get-file-color";
import { getFileSvg} from "@/src/utils/get-file-svg";
import { convertFileSize} from "@/src/utils/convert-file-size";
import { converCreatedAt} from "@/src/utils/conver-created-at";
import { useState } from "react";
import Modal from "../modal/Modal";

interface FileProps {
    file: FileResponse;
}

export default function FileCard({ file }: FileProps) {
    return (
        <div className="flex flex-col justify-center items-start">
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

            <h2
                className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate w-full flex items-start justify-start"
                title={file.name}
            >
                {file.name}
            </h2>

            <div
                className="w-full flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                <span>{convertFileSize(file.size_bytes)}</span>
                <span>{converCreatedAt(file.created_at)}</span>
            </div>
        </div>
    );
}
