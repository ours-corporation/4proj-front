import {getJwtToken} from "@/src/hooks/getJwtInformation";

export async function downloadFile({ fileId }: { fileId: number }): Promise<File> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

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

export async function uploadFileAPI(file: File | null, parentFolderId: number | null): Promise<Response> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    const formData = new FormData();
    if (file) {
        formData.append("file", file);
    }
    if (parentFolderId !== null) {
        formData.append("parent_id", parentFolderId.toString());
    }

    try {
        const rep = await fetch(`${url}/api/files/upload`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        if (!rep.ok) {
            throw new Error(`Erreur HTTP: ${rep.status}`);
        }

        return await rep;
    } catch (error) {
        throw error; // Relancer l'erreur pour que le composant la détecte
    }
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

export async function moveFileIntoFolder(fileId:number, folderId: string|null): Promise<File> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();
    const folderIdToSend = folderId === "null" ? null : Number(folderId);
    console.log(fileId);
    console.log(folderId);
    console.log(JSON.stringify({ folder_id : folderId }));  
     try {
        const rep = await fetch(`${url}/api/files/${fileId}/move`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ folder_id : folderIdToSend }),
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
