import { authFetch } from "@/src/api/authFetch";
import { FolderResponse } from "@/src/interface/folder";
import { FileResponse } from "@/src/interface/file";
import { FileShareItem } from "@/src/interface/share";

export interface FolderDetailResponse {
    current: FolderResponse;
    breadcrumbs: { id: number | null; name: string }[];
    folders: FolderResponse[];
    files: FileResponse[];
}

export interface FolderMovingResponse {
    moved: { type: "folder"; id: number }[];
    failed: { type: "folder"; id: number; error: string }[];
}

export async function getFolderById({ folderId }: { folderId: string }): Promise<FolderDetailResponse> {
    const rep = await authFetch(`/api/folders/${folderId}`, {
        headers: { "Content-Type": "application/json" },
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function deleteFolderById(folderId: number, force = false): Promise<void> {
    const endpoint = force ? `/api/folders/${folderId}` : `/api/folders/${folderId}/trash`;
    const rep = await authFetch(endpoint, { method: "DELETE" });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
}

export async function renameFolderById(folderId: number, newName: string): Promise<FolderResponse> {
    const rep = await authFetch(`/api/folders/${folderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function getFolderShares(folderId: number): Promise<FileShareItem[]> {
    const rep = await authFetch(`/api/folders/${folderId}/shares`);
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function createNewFolderAPI(folderName: string, parentFolderId: number | null): Promise<FolderResponse> {
    const rep = await authFetch(`/api/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: folderName, parent_id: parentFolderId }),
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function getRootFolder(): Promise<FolderDetailResponse> {
    const rep = await authFetch(`/api/folders`, {
        headers: { "Content-Type": "application/json" },
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function restoreFolder(folderId: number) {
    const rep = await authFetch(`/api/folders/${folderId}/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json() as Promise<FolderDetailResponse>;
}

export async function downloadFolder({ folderId }: { folderId: number }): Promise<File> {
    const rep = await authFetch(`/api/folders/${folderId}/download`);
    if (!rep.ok) {
        const data = await rep.json().catch(() => ({}));
        throw new Error(data.message || `Erreur HTTP: ${rep.status}`);
    }
    const blob = await rep.blob();
    return new File([blob], "downloaded_folder", { type: blob.type });
}

export async function moveFolderIntoFolder(
    movingFolderId: number | null,
    destinationFolderId: string | null,
): Promise<FolderMovingResponse> {
    const destinationFolderIdToSend = destinationFolderId === "null" ? null : Number(destinationFolderId);
    const rep = await authFetch(`/api/items/move`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            items: [{ type: "folder", id: movingFolderId }],
            destination_folder_id: destinationFolderIdToSend,
        }),
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function copyFolderById(folderId: number) {
    const rep = await authFetch(`/api/folders/${folderId}/copy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!rep.ok) {
        const data = await rep.json().catch(() => ({}));
        throw new Error(data.message || `Erreur HTTP: ${rep.status}`);
    }

    return rep.json() as Promise<FolderResponse>;
}
