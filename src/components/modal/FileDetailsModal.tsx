import { useState, useEffect } from 'react';
import Modal from '@/src/components/modal/Modal';
import { FileResponse } from '@/src/interface/file';
import { FileShareItem } from '@/src/interface/share';
import { convertFileSize } from '@/src/utils/convert-file-size';
import { getFileShares } from '@/src/api/file';
import SharesPanel from '@/src/components/SharesPanel';
import ImgPreview from '@/src/components/preview/imgPreview';
import PdfPreview from '@/src/components/preview/pdfPreview';
import VideoPreview from '@/src/components/preview/videoPreview';
import AudioPreview from '@/src/components/preview/audioPreview';
import TextPreview from '@/src/components/preview/textPreview';
import JsonPreview from '@/src/components/preview/jsonPreview';
import MarkdownPrev from '@/src/components/preview/markdownPreview'

interface FileDetailsModalProps {
    isOpen: boolean;
    selectedFile: FileResponse | null;
    file: File | null;
    fileLoading: boolean;
    currentUserId: string;
    onClose: () => void;
}

export default function FileDetailsModal({
    isOpen,
    selectedFile,
    file,
    fileLoading,
    currentUserId,
    onClose,
}: FileDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<'preview' | 'permissions'>('preview');
    const [shares, setShares] = useState<FileShareItem[]>([]);
    const [sharesLoading, setSharesLoading] = useState(false);
    const [sharesError, setSharesError] = useState(false);
    const isOwner = selectedFile && selectedFile.user_id === parseInt(currentUserId);

    useEffect(() => {
        if (activeTab !== 'permissions' || !selectedFile) return;
        setSharesLoading(true);
        setSharesError(false);
        getFileShares(selectedFile.id)
            .then(setShares)
            .catch(() => setSharesError(true))
            .finally(() => setSharesLoading(false));
    }, [activeTab, selectedFile]);

    function handleClose() {
        setActiveTab('preview');
        setShares([]);
        onClose();
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    };

    const renderPreviewContent = () => {
        if (!selectedFile) return null;

        if (fileLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-[300px] gap-4 text-gray-400">
                    <svg className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="text-sm">Chargement du fichier...</span>
                </div>
            );
        }

        const mimeType = selectedFile.mime_type;

        if (mimeType.startsWith('image/')) {
            return <ImgPreview file={file!} fileInformation={selectedFile} onClose={handleClose} />;
        }
        if (mimeType === 'application/pdf') {
            return <PdfPreview file={file!} fileInformation={selectedFile} onClose={handleClose} />;
        }
        if (mimeType.startsWith('video/')) {
            return <VideoPreview fileInformation={selectedFile} onClose={handleClose} />;
        }
        if (mimeType.startsWith('audio/')) {
            return <AudioPreview fileInformation={selectedFile} onClose={handleClose} />;
        }
        if (mimeType === 'text/plain') {
            return <TextPreview file={file!} fileInformation={selectedFile} onClose={handleClose} />;
        }
        if (mimeType === 'application/json') {
            return <JsonPreview file={file!} fileInformation={selectedFile} onClose={handleClose} />;
        }

        if (mimeType === 'text/markdown') {
            return <MarkdownPrev file={file!} fileInformation={selectedFile} onClose={handleClose} />;
        }

        return <p>Aperçu non disponible pour ce type de fichier.</p>;
    };

    // @ts-ignore
    return (
        <Modal
            isOpen={isOpen}
            title={selectedFile ? selectedFile.name : 'Détails du fichier'}
            onClose={handleClose}
        >
            {/* Onglets style navigateur — uniquement si propriétaire */}
            {isOwner && (
                <div className="flex border-b border-border-subtle dark:border-dark-border-subtle -mt-2 mb-4">
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'preview'
                                ? 'border-action dark:border-dark-action text-action dark:text-dark-action'
                                : 'border-transparent text-txt-secondary dark:text-dark-txt-secondary hover:text-txt-primary dark:hover:text-dark-txt-primary'
                        }`}
                        onClick={() => setActiveTab('preview')}
                    >
                        Aperçu
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'permissions'
                                ? 'border-action dark:border-dark-action text-action dark:text-dark-action'
                                : 'border-transparent text-txt-secondary dark:text-dark-txt-secondary hover:text-txt-primary dark:hover:text-dark-txt-primary'
                        }`}
                        onClick={() => setActiveTab('permissions')}
                    >
                        Droits d&apos;accès
                    </button>
                </div>
            )}

            {/* Onglet Aperçu — toujours monté pour éviter le reset de la preview */}
            <div className={activeTab === 'preview' ? '' : 'hidden'}>
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
            </div>

            {/* Onglet Droits d'accès */}
            <div className={activeTab === 'permissions' ? '' : 'hidden'}>
                <SharesPanel
                    shares={shares}
                    setShares={setShares}
                    sharesLoading={sharesLoading}
                    sharesError={sharesError}
                />
            </div>
        </Modal>
    );
}
