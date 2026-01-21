import {getJwtToken} from "@/src/hooks/getJwtInformation";
import {FolderResponse, FolderShareResponse} from "@/src/interface/folder";
import {FileResponse, FileShareResponse} from "@/src/interface/file";

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
    folders: FolderShareResponse[];
    files: FileShareResponse[];
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