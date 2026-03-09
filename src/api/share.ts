import {getJwtToken} from "@/src/hooks/getJwtInformation";
import {FolderResponse, FolderShareResponse} from "@/src/interface/folder";
import {FileResponse, FileShareResponse} from "@/src/interface/file";
import { PublicShareResponse } from "@/src/interface/share";

export async function createPublicShareAPI(fileId?: number, folderId?: number, password?: string, expiresAt?: string) : Promise<Response> {
    const url = process.env.NEXT_PUBLIC_API_URL
    const token = getJwtToken();

    return await fetch( url + "/api/shares/public", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ fileId : fileId, folderId : folderId, password : password, expiresAt : expiresAt }),
    });
}

export async function createPrivateShareAPI(fileId?: number, folderId?: number, email?: string, permission?: 'READ' | 'WRITE') : Promise<Response> {
    const url = process.env.NEXT_PUBLIC_API_URL
    const token = getJwtToken();

    return await fetch( url + "/api/shares/private", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ fileId : fileId, folderId : folderId, email : email, permission : permission }),
    });
}

export interface FolderShareDetailResponse {
    folders: FolderResponse[];
    files: FileResponse[];
}

export async function getReceivedSharesAPI() : Promise<FolderShareDetailResponse> {
    const url = process.env.NEXT_PUBLIC_API_URL
    const token = getJwtToken();

    const rep =  await fetch( url + "/api/shares/received", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return rep.json();
}

// Public Share
export async function getPublicShareAPI(uuid: string, password?: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${baseUrl}/api/public/access/${uuid}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: password ? JSON.stringify({ password }) : JSON.stringify({}),
        cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
        return { success: true, data: data };
    }
    if (response.status === 403) {
        return {
            success: false,
            error: "PASSWORD_REQUIRED",
            message: data.message,
            protected: data.protected
        };
    }
    if (response.status === 404 || response.status === 410) {
        return { success: false, error: "LINK_INVALID", status: response.status };
    }
    return { success: false, error: "UNKNOWN_ERROR", message: data.message };
}

export async function downloadPublicShareAPI(token: string, password?: string): Promise<Response> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    return await fetch(`${baseUrl}/api/public/download/${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: password ? JSON.stringify({ password }) : undefined,
        cache: "no-store",
    });
}