import {downloadPublicFolderShareAPI} from "@/src/api/share";

export async function downloadPublicFolderService(uuid: string, folderName:string, password?: string) {
    if (!uuid) return;

    const response = await downloadPublicFolderShareAPI(uuid, password);

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', folderName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}