import { authFetch } from "@/src/api/authFetch";
import { FolderResponse } from "@/src/interface/folder";
import { FileResponse } from "@/src/interface/file";

export interface TrashResponse {
    folders: FolderResponse[];
    files: FileResponse[];
}

export interface DeleteTrashResponse {
    message: string;
}

export async function getTrashAPI(): Promise<TrashResponse> {
    const rep = await authFetch(`/api/trash`);
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function deleteTrash(): Promise<DeleteTrashResponse> {
    const rep = await authFetch(`/api/trash`, { method: "DELETE" });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}
