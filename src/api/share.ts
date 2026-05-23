import { authFetch } from "@/src/api/authFetch";
import { FolderResponse } from "@/src/interface/folder";
import { FileResponse } from "@/src/interface/file";
import { SentShare } from "@/src/interface/share";

export async function createPublicShareAPI(fileId?: number, folderId?: number, password?: string, expiresAt?: string): Promise<Response> {
    return authFetch(`/api/shares/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, folderId, password, expiresAt }),
    });
}

export async function createPrivateShareAPI(fileId?: number, folderId?: number, email?: string, permission?: 'READ' | 'WRITE'): Promise<Response> {
    return authFetch(`/api/shares/private`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, folderId, email, permission }),
    });
}

export interface FolderShareDetailResponse {
    folders: FolderResponse[];
    files: FileResponse[];
}

export async function getReceivedSharesAPI(): Promise<FolderShareDetailResponse> {
    const rep = await authFetch(`/api/shares/received`, {
        headers: { "Content-Type": "application/json" },
    });
    return rep.json();
}

// Public Share — pas d'auth requise
export async function getPublicShareAPI(uuid: string, password?: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/api/public/access/${uuid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: password ? JSON.stringify({ password }) : JSON.stringify({}),
        cache: "no-store",
    });
    const data = await response.json();
    if (response.ok) return { success: true, data };
    if (response.status === 403) return { success: false, error: "PASSWORD_REQUIRED", message: data.message, protected: data.protected };
    if (response.status === 404 || response.status === 410) return { success: false, error: "LINK_INVALID", status: response.status };
    return { success: false, error: "UNKNOWN_ERROR", message: data.message };
}

export async function downloadPublicFolderShareAPI(token: string, password?: string): Promise<Response> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    return fetch(`${baseUrl}/api/public/download/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/zip" },
        body: password ? JSON.stringify({ password }) : undefined,
        cache: "no-store",
    });
}

export async function downloadPublicFileShareAPI(token: string, password?: string): Promise<File> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const rep = await fetch(`${baseUrl}/api/public/stream/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: password ? JSON.stringify({ password }) : undefined,
        cache: "no-store",
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    const blob = await rep.blob();
    return new File([blob], "downloaded_file", { type: blob.type });
}

export async function getSentSharesAPI(): Promise<SentShare[]> {
    const rep = await authFetch(`/api/shares/sent`, {
        headers: { "Content-Type": "application/json" },
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function updateShareAPI(shareId: number, permission?: 'READ' | 'WRITE', password?: string | null, expiresAt?: string | null): Promise<void> {
    const rep = await authFetch(`/api/shares/${shareId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission, password, expiresAt }),
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
}

export async function deleteShareAPI(shareId: number): Promise<void> {
    const rep = await authFetch(`/api/shares/${shareId}`, { method: "DELETE" });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
}
