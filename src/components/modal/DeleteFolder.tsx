import { FolderResponse } from "@/src/interface/folder";
import { deleteFolderById } from "@/src/api/folders";
import DeleteModal from "@/src/components/modal/DeleteModal";

interface DeleteFolderModalProps {
    isOpen?: boolean;
    folderInfo?: FolderResponse;
    closeModal: () => void;
    onSuccess?: () => void;
}

export default function DeleteFolderModal({ isOpen, closeModal, folderInfo, onSuccess }: DeleteFolderModalProps) {
    if (!folderInfo) return null;

    return (
        <DeleteModal
            isOpen={isOpen}
            title="Supprimer le dossier"
            message={<>Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{folderInfo.name}</span> ?</>}
            closeModal={closeModal}
            onConfirm={async (force) => {
                await deleteFolderById(folderInfo.id, force);
                onSuccess?.();
            }}
            checkboxLabel="Suppression forcée"
        />
    );
}
