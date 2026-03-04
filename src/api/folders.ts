import {getJwtToken} from "@/src/hooks/getJwtInformation";
import {FolderResponse} from "@/src/interface/folder";
import {FileResponse} from "@/src/interface/file";

export interface FolderDetailResponse {
    current: FolderResponse;
    breadcrumbs: { id: number | null; name: string }[];
    folders: FolderResponse[];
    files: FileResponse[];
}

export async function getFolderById({ folderId }: { folderId: string }): Promise<FolderDetailResponse> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken(); // Assurez-vous que ceci retourne le token string


    try {
        const rep = await fetch(`${url}/api/folders/${folderId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!rep.ok) {
            throw new Error(`Erreur HTTP: ${rep.status}`);
        }

        const data: FolderDetailResponse = await rep.json();
        return data;

    } catch (error) {
        throw error;
    }
}

export async function createNewFolderAPI(folderName: string, parentFolderId: number | null): Promise<FolderResponse> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    try {
        const rep = await fetch(`${url}/api/folders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: folderName,
                parent_id: parentFolderId,
            }),
        });

        if (!rep.ok) {
            throw new Error(`Erreur HTTP: ${rep.status}`);
        }

        return await rep.json();

    } catch (error) {
        throw error;
    }
}

export async function getRootFolder():Promise<FolderDetailResponse>{
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();
    try {
        const rep = await fetch(`${url}/api/folders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!rep.ok) {
            throw new Error(`Erreur HTTP: ${rep.status}`);
        }

        const data = await rep.json();
        return data as FolderDetailResponse;

    } catch (error) {
        throw error;
    }
}