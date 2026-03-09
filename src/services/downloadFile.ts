import {downloadFile} from "@/src/api/file";

export async function downloadFileService(fileId: number | null, fileName: string) {
    if (!fileId) return;
    if (!fileName) return;
    try {
        const downloadedData = await downloadFile({ fileId });
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