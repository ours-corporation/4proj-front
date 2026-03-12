import {getJwtToken} from "@/src/hooks/getJwtInformation";
import {FolderResponse} from "@/src/interface/folder";
import {FileResponse} from "@/src/interface/file";
import { FileShareItem } from "@/src/interface/share";

export interface FolderDetailResponse {
    current: FolderResponse;
    breadcrumbs: { id: number | null; name: string }[];
    folders: FolderResponse[];
    files: FileResponse[];
}


export interface FolderMovingResponse {
    moved: {
        type: "folder";
        id: number;
    }[];
    failed: {
        type: "folder";
        id: number;
        error: string;
    }[];
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

export async function deleteFolderById(folderId: number, force = false): Promise<void> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    const endpoint = force
        ? `${url}/api/folders/${folderId}/trash`
        : `${url}/api/folders/${folderId}`;

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

export async function renameFolderById(folderId: number, newName: string): Promise<FolderResponse> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    const rep = await fetch(`${url}/api/folders/${folderId}`, {
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

    return await rep.json();
}

export async function getFolderShares(folderId: number): Promise<FileShareItem[]> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    const rep = await fetch(`${url}/api/folders/${folderId}/shares`, {
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


export async function moveFolderIntoFolder(movingFolderId:number, destinationFolderId: string|null): Promise<FolderMovingResponse> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();
    const destinationFolderIdToSend = destinationFolderId === "null" ? null : Number(destinationFolderId);
     try {
        const rep = await fetch(`${url}/api/items/move`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(
                { items : [
                    {
                        type: "folder", 
                        id: movingFolderId
                    }

                ],
                "destination_folder_id": destinationFolderId
                }
            ),
        });

        if (!rep.ok) {
            throw new Error(`Erreur HTTP: ${rep.status}`);
        }
        const data = await rep.json();
        return data as FolderMovingResponse;
    }
    catch (error) {
        throw error;
    }

}