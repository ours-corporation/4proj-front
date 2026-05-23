import { authFetch, getValidToken } from "@/src/api/authFetch";
import { FileResponse } from "../interface/file";
import { FileShareItem } from "../interface/share";

export async function downloadFile({ fileId, mimeType }: { fileId: number; mimeType?: string }): Promise<File> {
    const rep = await authFetch(`/api/files/${fileId}/download`);
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    const blob = await rep.blob();
    const type = mimeType || blob.type || 'application/octet-stream';
    return new File([blob], "downloaded_file", { type });
}

export function uploadFileAPI(
    file: File | null,
    parentFolderId: number | null,
    onProgress?: (percent: number) => void,
): Promise<{ ok: boolean; statusText: string }> {
    return new Promise(async (resolve, reject) => {
        const url = process.env.NEXT_PUBLIC_API_URL;
        const token = await getValidToken();

        const formData = new FormData();
        if (file) formData.append("file", file);
        if (parentFolderId !== null) formData.append("folder_id", parentFolderId.toString());

        const xhr = new XMLHttpRequest();

        if (onProgress) {
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
            });
        }

        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve({ ok: true, statusText: xhr.statusText });
            } else if (xhr.status === 401) {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                resolve({ ok: false, statusText: xhr.statusText });
            } else {
                resolve({ ok: false, statusText: xhr.statusText });
            }
        });

        xhr.addEventListener("error", () => reject(new Error(`Erreur réseau: ${xhr.status}`)));

        xhr.open("POST", `${url}/api/files/upload`);
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
    });
}

export function uploadFilesAPI(
    files: File[],
    parentFolderId: number | null,
    onProgress?: (percent: number) => void,
): Promise<{ ok: boolean; statusText: string }> {
    return new Promise(async (resolve, reject) => {
        const url = process.env.NEXT_PUBLIC_API_URL;
        const token = await getValidToken();

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        if (parentFolderId !== null) formData.append("folder_id", parentFolderId.toString());

        const xhr = new XMLHttpRequest();

        if (onProgress) {
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
            });
        }

        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve({ ok: true, statusText: xhr.statusText });
            } else if (xhr.status === 401) {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                resolve({ ok: false, statusText: xhr.statusText });
            } else {
                resolve({ ok: false, statusText: xhr.statusText });
            }
        });

        xhr.addEventListener("error", () => reject(new Error(`Erreur réseau: ${xhr.status}`)));

        xhr.open("POST", `${url}/api/files/uploads`);
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
    });
}

export async function deleteFileById(fileId: number, force = false): Promise<void> {
    const endpoint = force ? `/api/files/${fileId}` : `/api/files/${fileId}/trash`;
    const rep = await authFetch(endpoint, { method: "DELETE" });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
}

export async function getFileThumbnail(fileId: number, size: "small" | "medium" = "medium"): Promise<Blob> {
    const rep = await authFetch(`/api/files/${fileId}/thumbnail?size=${size}`);
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.blob();
}

export async function updateFileMetadata(fileId: number, newName: string): Promise<File> {
    const rep = await authFetch(`/api/files/${fileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function moveFileIntoFolder(fileId: number, folderId: string | null): Promise<File> {
    const folderIdToSend = folderId === "null" ? null : Number(folderId);
    const rep = await authFetch(`/api/files/${fileId}/move`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder_id: folderIdToSend }),
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function getRecentFilesAPI(limit: number = 10): Promise<FileResponse[]> {
    const rep = await authFetch(`/api/files/recent?limit=${limit}`);
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function getFileShares(fileId: number): Promise<FileShareItem[]> {
    const rep = await authFetch(`/api/files/${fileId}/shares`);
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function restoreFile(fileId: number) {
    const rep = await authFetch(`/api/files/${fileId}/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json() as Promise<FileResponse>;
}

export async function copyFileById(fileId: number) {
    const rep = await authFetch(`/api/files/${fileId}/copy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!rep.ok) {
        const data = await rep.json().catch(() => ({}));
        throw new Error(data.message || `Erreur HTTP: ${rep.status}`);
    }

    return rep.json() as Promise<FileResponse>;
}
