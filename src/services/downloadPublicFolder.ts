import {downloadPublicFolderShareAPI} from "@/src/api/share";

export async function downloadPublicFolderService(uuid: string, folderName:string, password?: string) {
    if (!uuid) return;
    try {
        const downloadedData = await downloadPublicFolderShareAPI( uuid, password);

        const blob = await downloadedData.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', folderName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Erreur lors du téléchargement :", error);
    }
}