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

        console.log(rep);

        if (!rep.ok) {
            throw new Error(`Erreur HTTP: ${rep.status}`);
        }

        const blob = await rep.blob();
        return new File([blob], "downloaded_file", {type: blob.type});

    } catch (error) {
        console.error("Erreur fetch:", error);
        throw error; // Relancer l'erreur pour que le composant la détecte
    }
}