import { FolderResponse } from "@/src/interface/folder";
import { moveFolderIntoFolder } from "@/src/api/folders";
import MoveModal from "@/src/components/modal/MoveModal";

interface MoveFolderModalProps {
    isOpen?: boolean;
    folderInfo: FolderResponse;
    closeModal: () => void;
    onSuccess?: () => void;
}

export default function MoveFolderModal({ isOpen, folderInfo, closeModal, onSuccess }: MoveFolderModalProps) {
    if (!folderInfo) return null;

    return (
        <MoveModal
            isOpen={isOpen}
            title="Déplacer le dossier"
            itemLabel="Dossier"
            itemName={folderInfo.name}
            parentId={folderInfo.parent_id}
            excludeId={folderInfo.id}
            closeModal={closeModal}
            onMove={async (destinationId) => {
                await moveFolderIntoFolder(folderInfo.id, destinationId);
                onSuccess?.();
            }}
        />
    );
}
