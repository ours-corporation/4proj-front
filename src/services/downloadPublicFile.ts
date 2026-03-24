import {downloadPublicFileShareAPI} from "@/src/api/share";

export async function downloadPublicFileService(uuid: string, fileName:string, password?: string) {
    if (!uuid) return;
    try {
        const downloadedData = await downloadPublicFileShareAPI( uuid, password);

        
        const url = window.URL.createObjectURL(downloadedData);
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