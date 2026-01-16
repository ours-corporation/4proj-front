import React, {useState} from 'react';

import { FolderResponse } from '@/src/interface/folder';
import {FileResponse} from "@/src/interface/file";

import FileCard from "@/src/components/card/FileCard";
import Modal from "@/src/components/modal/Modal";
import ImgPreview from "@/src/components/preview/imgPreview";
import { downloadFile } from '@/src/api/file';

interface FoldersProps {
    listFolders: FolderResponse[];
    listFiles?: FileResponse[];
    changeFolderId: (newFolderIdNumber: number | null) => Promise<void>;
}

export default function Folders({ listFolders, listFiles, changeFolderId }: FoldersProps) {
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileResponse | null>(null);
    const [file , setFile] = useState<File | null>(null);

    function setFileInformationAndOpen(file: FileResponse) {
        setSelectedFile(file);
        const fileDownload = async () => {
            const downloadedFile = await downloadFile({ fileId: file.id });
            setFile(downloadedFile);
            setOpen(true);
        }
        fileDownload();
    }

    function setFileInformationAndClose() {
        setOpen(false);
        setSelectedFile(null);
        setFile(null);
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {listFolders.map((folder) => (
                <button
                    key={folder.id}
                    className="bg-surface dark:bg-dark-surface p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
                    onClick={() => changeFolderId(folder.id)}
                >
                    <div className="flex flex-col items-center space-x-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-24 h-24 text-action dark:text-dark-action">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"/>
                        </svg>
                        <h2 className="text-xl font-semibold text-txt-primary dark:text-dark-txt-primary">
                            {folder.name}
                        </h2>
                    </div>
                </button>
            ))}
            {listFiles && listFiles.map((file) => (
                <button onClick={() => setFileInformationAndOpen(file)} key={file.id}
                    className="bg-white dark:bg-dark-surface p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 w-full max-w-xs cursor-pointer"
                >
                    <FileCard file={file} key={file.id} />
                </button>
            ))}
            <Modal
                isOpen={open}
                title={selectedFile ? selectedFile.name : 'Détails du fichier'}
                onClose={() => setFileInformationAndClose()}
            >
                <ImgPreview
                    file={file!}
                    fileInformation={selectedFile!}
                    onClose={() => setFileInformationAndClose()}
                />
            </Modal>
        </div>
    );
}
