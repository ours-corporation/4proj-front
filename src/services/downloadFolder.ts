import {downloadFolder} from "@/src/api/folders";

export async function downloadFolderService(folderId: number | null, folderName: string) {
    if (!folderId) return;
    if (!folderName) return;
    const downloadedData = await downloadFolder({ folderId });
    const url = window.URL.createObjectURL(downloadedData);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', folderName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}