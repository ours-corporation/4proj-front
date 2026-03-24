import { getJwtToken } from "@/src/hooks/getJwtInformation";
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
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    const rep = await fetch(`${url}/api/trash`, {
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

export async function deleteTrash():Promise<DeleteTrashResponse>{
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    const rep = await fetch(`${url}/api/trash`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!rep.ok) {
        throw new Error(`Erreur HTTP: ${rep.status}`);
    }

    return rep.json();
}