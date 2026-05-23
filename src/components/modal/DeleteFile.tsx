import { FileResponse } from "@/src/interface/file";
import { deleteFileById } from "@/src/api/file";
import DeleteModal from "@/src/components/modal/DeleteModal";

interface DeleteFileModalProps {
    isOpen?: boolean;
    fileInfo?: FileResponse;
    closeModal: () => void;
    onSuccess?: () => void;
    isTrash?: boolean;
}

export default function DeleteFileModal({ isOpen, closeModal, fileInfo, onSuccess, isTrash }: DeleteFileModalProps) {
    if (!fileInfo) return null;

    return (
        <DeleteModal
            isOpen={isOpen}
            title="Supprimer le fichier"
            message={<>Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{fileInfo.fullName}</span> ?</>}
            closeModal={closeModal}
            onConfirm={async (force) => {
                await deleteFileById(fileInfo.id, isTrash ? true : force);
                onSuccess?.();
            }}
            checkboxLabel={!isTrash ? "Suppression forcée" : undefined}
        />
    );
}
