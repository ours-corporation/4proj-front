import { deleteTrash } from '@/src/api/trash';
import DeleteModal from "@/src/components/modal/DeleteModal";

interface DeleteTrashModalProps {
    isOpen?: boolean;
    closeModal: () => void;
}

export default function DeleteTrashModal({ isOpen, closeModal }: DeleteTrashModalProps) {
    return (
        <DeleteModal
            isOpen={isOpen}
            title="Supprimer la corbeille"
            message="Êtes-vous sûr de vouloir supprimer l'intégralité de la corbeille ?"
            closeModal={closeModal}
            onConfirm={async () => { await deleteTrash(); }}
            checkboxLabel="J'accepte la suppression définitive et irréversible de mes données."
            requireCheckbox
        />
    );
}
