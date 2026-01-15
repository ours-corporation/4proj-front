import { getJwtToken } from "@/src/hooks/getJwtInformation";
import { FolderResponse } from "@/src/interface/folder";
import { FileResponse } from "@/src/interface/file";

export interface FolderDetailResponse {
    current: FolderResponse;
    breadcrumbs: { id: number | null; name: string }[];
    folders: FolderResponse[];
    files: FileResponse[];
}

export async function getFolderById({ folderId }: { folderId: string }): Promise<FolderDetailResponse> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken(); // Assurez-vous que ceci retourne le token string

    // Gestion du cas où folderId est vide (si besoin d'une racine par défaut)
    // const targetId = folderId || 'root';

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
        console.error("Erreur fetch:", error);
        throw error; // Relancer l'erreur pour que le composant la détecte
    }
}