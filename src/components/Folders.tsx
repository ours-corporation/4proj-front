import React, {useState} from 'react';

import { FolderResponse } from '@/src/interface/folder';
import {FileResponse} from "@/src/interface/file";

import FileCard from "@/src/components/card/FileCard";
import Modal from "@/src/components/modal/Modal";
import ImgPreview from "@/src/components/preview/imgPreview";
import { downloadFile } from '@/src/api/file';
import PdfPreview from "@/src/components/preview/pdfPreview";
import VideoPreview from "@/src/components/preview/videoPreview";
import AudioPreview from "@/src/components/preview/audioPreview";
import FolderCard from "@/src/components/card/FolderCard";
import {convertFileSize} from "@/src/utils/convert-file-size";

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

    // J'ajoute fileName en paramètre pour nommer correctement le fichier téléchargé
    async function downloadFileById(fileId: number | null, fileName: string) {
        if (!fileId) return;
        if (!fileName) return;
        try {
            const downloadedData = await downloadFile({ fileId });
            const url = window.URL.createObjectURL(downloadedData);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const renderPreviewContent = () => {
        if (!selectedFile) return null;

        const mimeType = selectedFile.mime_type;

        if (mimeType.startsWith('image/')) {
            return (
                <ImgPreview
                    file={file!}
                    fileInformation={selectedFile!}
                    onClose={() => setFileInformationAndClose()}
                />
            );
        }

        if (mimeType === 'application/pdf') {
            return (
                <PdfPreview
                    file={file!}
                    fileInformation={selectedFile!}
                    onClose={() => setFileInformationAndClose()}
                />
            );
        }

        //gestion des vidéos
        if (mimeType.startsWith('video/')) {
            return (
                <VideoPreview
                    file={file!}
                    fileInformation={selectedFile!}
                    onClose={() => setFileInformationAndClose()}
                />
            );
        }

        if (mimeType.startsWith('audio/')) {
            return (
                <AudioPreview
                    file={file!}
                    fileInformation={selectedFile!}
                    onClose={() => setFileInformationAndClose()}
                />
            );
        }

        // 4. Par défaut (type inconnu)
        return <p>Aperçu non disponible pour ce type de fichier.</p>;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {listFolders.map((folder) => (
                <button
                    key={folder.id}
                    className="bg-surface dark:bg-dark-surface p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
                    onClick={() => changeFolderId(folder.id)}
                >
                    <FolderCard
                        folder={folder}
                        key={folder.id}
                    />
                </button>
            ))}
            {listFiles && listFiles.map((file) => (
                <button onClick={() => setFileInformationAndOpen(file)} key={file.id}
                    className="bg-white dark:bg-dark-surface p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 w-full max-w-xs cursor-pointer"
                >
                    <FileCard
                        file={file}
                        key={file.id}
                        downloadFile={downloadFileById}
                        editFile={undefined}
                        deleteFile={undefined}
                    />
                </button>
            ))}


            <Modal
                isOpen={open}
                title={selectedFile ? selectedFile.name : 'Détails du fichier'}
                onClose={() => setFileInformationAndClose()}
            >
                <div className="space-y-6">
                    {renderPreviewContent()}
                    <div className="bg-main-bg dark:bg-dark-surface rounded-xl p-4 border border-border-subtle dark:border-dark-border-subtle">
                        <h3 className="text-xs font-semibold text-txt-primary dark:text-dark-txt-primary uppercase tracking-wider mb-3">
                            Métadonnées
                        </h3>
                        <dl className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                            <div>
                                <dt className="text-txt-primary dark:text-dark-txt-primary mb-1">Nom du fichier</dt>
                                <dd className="font-medium text-txt-secondary dark:text-dark-txt-secondary truncate" title={selectedFile?.name}>
                                    {selectedFile?.name}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-txt-primary dark:text-dark-txt-primary mb-1">Taille</dt>
                                <dd className="font-medium text-txt-secondary dark:text-dark-txt-secondary">
                                    {convertFileSize(selectedFile?.size_bytes)}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-txt-primary dark:text-dark-txt-primary mb-1">Type MIME</dt>
                                <dd className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    {selectedFile?.mime_type || 'Inconnu'}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-txt-primary dark:text-dark-txt-primary mb-1">Dernière modification</dt>
                                <dd className="font-medium text-txt-secondary dark:text-dark-txt-secondary">
                                    {selectedFile ? formatDate(selectedFile.updatedAt) : ''}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
