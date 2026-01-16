// types/file-mime.ts

// 1. L'Enum pour un typage strict (Optionnel mais recommandé)
export enum MimeType {
    // Documents
    PDF = 'application/pdf',
    DOC = 'application/msword',
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    XLS = 'application/vnd.ms-excel',
    XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PPT = 'application/vnd.ms-powerpoint',
    PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    // Images
    JPEG = 'image/jpeg',
    PNG = 'image/png',
    GIF = 'image/gif',
    WEBP = 'image/webp',
    SVG = 'image/svg+xml',

    // Video & Audio
    MP4 = 'video/mp4',
    WEBM = 'video/webm',
    MP3 = 'audio/mpeg',
    WAV = 'audio/wav',

    // Code & Data
    JSON = 'application/json',
    ZIP = 'application/zip',
    TXT = 'text/plain',
    CSV = 'text/csv',
}

// 2. L'objet de mapping (Mime -> Couleur Hex)
export const MimeColors: Record<string, string> = {
    // Documents
    [MimeType.PDF]: '#FF0000',
    [MimeType.DOC]: '#2B579A',
    [MimeType.DOCX]: '#2B579A',
    [MimeType.XLS]: '#217346',
    [MimeType.XLSX]: '#217346',
    [MimeType.PPT]: '#D24726',
    [MimeType.PPTX]: '#D24726',

    // Images
    [MimeType.JPEG]: '#2ECC71',
    [MimeType.PNG]: '#16A085',
    [MimeType.GIF]: '#8E44AD',
    [MimeType.WEBP]: '#9B59B6',
    [MimeType.SVG]: '#FF9F43',

    // Multimedia
    [MimeType.MP4]: '#C0392B',
    [MimeType.WEBM]: '#2980B9',
    [MimeType.MP3]: '#F1C40F',
    [MimeType.WAV]: '#1ABC9C',

    // Autres
    [MimeType.JSON]: '#F1C40F',
    [MimeType.ZIP]: '#F39C12',
    [MimeType.TXT]: '#7F8C8D',
    [MimeType.CSV]: '#27AE60',
};

export const MimeSvgs: Record<string, string> = {
    [MimeType.PDF]: '/svgs/mime/pdf.svg',
    [MimeType.DOC]: '/svgs/mime/doc.svg',
    [MimeType.DOCX]: '/svgs/mime/docx.svg',
    [MimeType.XLS]: '/svgs/mime/xls.svg',
    [MimeType.XLSX]: '/svgs/mime/xlsx.svg',
    [MimeType.PPT]: '/svgs/mime/ppt.svg',
    [MimeType.PPTX]: '/svgs/mime/pptx.svg',

    // Images
    [MimeType.JPEG]: '/svgs/mime/jpeg.svg',
    [MimeType.PNG]: '/svgs/mime/png.svg',
    [MimeType.GIF]: '/svgs/mime/gif.svg',
    [MimeType.WEBP]: '/svgs/mime/webp.svg',
    [MimeType.SVG]: '/svgs/mime/svg.svg',

    // Multimedia
    [MimeType.MP4]: '/svgs/mime/mp4.svg',
    [MimeType.WEBM]: '/svgs/mime/webm.svg',
    [MimeType.MP3]: '/svgs/mime/mp3.svg',
    [MimeType.WAV]: '/svgs/mime/wav.svg',

    // Autres
    [MimeType.JSON]: '/svgs/mime/json.svg',
    [MimeType.ZIP]: '/svgs/mime/zip.svg',
    [MimeType.TXT]: '/svgs/mime/txt.svg',
    [MimeType.CSV]: '/svgs/mime/csv.svg',
}