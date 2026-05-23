import { FileResponse } from "@/src/interface/file";
import { moveFileIntoFolder } from "@/src/api/file";
import MoveModal from "@/src/components/modal/MoveModal";

interface MoveFileModalProps {
    isOpen?: boolean;
    fileInfo: FileResponse;
    closeModal: () => void;
}

export default function MoveFileModal({ isOpen, fileInfo, closeModal }: MoveFileModalProps) {
    if (!fileInfo) return null;

    return (
        <MoveModal
            isOpen={isOpen}
            title="Déplacer le fichier"
            itemLabel="Fichier"
            itemName={`${fileInfo.name}.${fileInfo.extension}`}
            parentId={fileInfo.folder_id}
            closeModal={closeModal}
            onMove={async (destinationId) => {
                await moveFileIntoFolder(fileInfo.id, destinationId);
            }}
        />
    );
}
