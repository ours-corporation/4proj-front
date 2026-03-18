import {downloadPublicShareAPI} from "@/src/api/share";

export async function downloadPublicFileService(uuid: string, password?: string) {
    if (!uuid) return;
    try {
        const downloadedData = await downloadPublicShareAPI( uuid, password);

        const disposition = downloadedData.headers.get('Content-Disposition');
        const fileName = disposition?.match(/filename="(.+)"/)?.[1] ?? `fichier_${uuid}`;


        const blob = await downloadedData.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Erreur lors du téléchargement :", error);
    }
}