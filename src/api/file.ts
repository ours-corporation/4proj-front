import {getJwtToken} from "@/src/hooks/getJwtInformation";
import { FileResponse } from "@/src/interface/file";
import { FileShareItem } from "@/src/interface/share";

export async function downloadFile({ fileId }: { fileId: number }): Promise<File> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    console.log(`${url}/api/files/${fileId}/download`);

    try {
        const rep = await fetch(`${url}/api/files/${fileId}/download`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!rep.ok) {
            throw new Error(`Erreur HTTP: ${rep.status}`);
        }

        const blob = await rep.blob();
        return new File([blob], "downloaded_file", {type: blob.type});

    } catch (error) {
        throw error;
    }
}

export function uploadFileAPI(
    file: File | null,
    parentFolderId: number | null,
    onProgress?: (percent: number) => void,
): Promise<{ ok: boolean; statusText: string }> {
    return new Promise((resolve, reject) => {
        const url = process.env.NEXT_PUBLIC_API_URL;
        const token = getJwtToken();

        console.log("----------------")
        console.log(parentFolderId)

        const formData = new FormData();
        if (file) formData.append("file", file);
        if (parentFolderId !== null) formData.append("folder_id", parentFolderId.toString());

        const xhr = new XMLHttpRequest();

        if (onProgress) {
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    onProgress(Math.round((e.loaded / e.total) * 100));
                }
            });
        }

        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve({ ok: true, statusText: xhr.statusText });
            } else {
                resolve({ ok: false, statusText: xhr.statusText });
            }
        });

        xhr.addEventListener("error", () => {
            reject(new Error(`Erreur réseau: ${xhr.status}`));
        });

        console.log(`${url}/api/files/upload`)
        console.log(formData)

        xhr.open("POST", `${url}/api/files/upload`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
    });
}

export function uploadFilesAPI(
    files: File[],
    parentFolderId: number | null,
    onProgress?: (percent: number) => void,
): Promise<{ ok: boolean; statusText: string }> {
    return new Promise((resolve, reject) => {
        const url = process.env.NEXT_PUBLIC_API_URL;
        const token = getJwtToken();

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        if (parentFolderId !== null) formData.append("folder_id", parentFolderId.toString());

        const xhr = new XMLHttpRequest();

        if (onProgress) {
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    onProgress(Math.round((e.loaded / e.total) * 100));
                }
            });
        }

        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve({ ok: true, statusText: xhr.statusText });
            } else {
                resolve({ ok: false, statusText: xhr.statusText });
            }
        });

        xhr.addEventListener("error", () => {
            reject(new Error(`Erreur réseau: ${xhr.status}`));
        });

        xhr.open("POST", `${url}/api/files/uploads`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
    });
}

export async function deleteFileById(fileId: number, force = false): Promise<void> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    const endpoint = force
        ? `${url}/api/files/${fileId}`
        : `${url}/api/files/${fileId}/trash`;

    const rep = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!rep.ok) {
        throw new Error(`Erreur HTTP: ${rep.status}`);
    }
}

export async function getFileThumbnail(fileId: number, size: "small" | "medium" = "medium"): Promise<Blob> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    const rep = await fetch(`${url}/api/files/${fileId}/thumbnail?size=${size}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!rep.ok) {
        throw new Error(`Erreur HTTP: ${rep.status}`);
    }

    return rep.blob();
}

export async function updateFileMetadata(fileId: number, newName: string): Promise<File> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    try {
        const rep = await fetch(`${url}/api/files/${fileId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newName }),
        });
        if (!rep.ok) {
            throw new Error(`Erreur HTTP: ${rep.status}`);
        }
        const data = await rep.json();
        return data as File;
    }
    catch (error) {
        throw error;
    }
}

export async function getRecentFilesAPI(limit: number = 10): Promise<FileResponse[]> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    const rep = await fetch(`${url}/api/files/recent?limit=${limit}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!rep.ok) {
        throw new Error(`Erreur HTTP: ${rep.status}`);
    }

    return rep.json();
}

export async function getFileShares(fileId: number): Promise<FileShareItem[]> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    const rep = await fetch(`${url}/api/files/${fileId}/shares`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!rep.ok) {
        throw new Error(`Erreur HTTP: ${rep.status}`);
    }

    return rep.json();
}