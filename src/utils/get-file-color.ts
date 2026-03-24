import { MimeColors } from '@/src/types/file-mime';

const DEFAULT_COLOR = '#95A5A6'; // Gris neutre par défaut

export const getFileColor = (mimeType: string): string => {
    if (MimeColors[mimeType]) {
        return MimeColors[mimeType];
    }

    if (!mimeType) return DEFAULT_COLOR;

    if (mimeType.startsWith('image/')) return '#2ECC71'; // Vert générique
    if (mimeType.startsWith('video/')) return '#C0392B'; // Rouge vidéo
    if (mimeType.startsWith('audio/')) return '#F1C40F'; // Jaune audio
    if (mimeType.startsWith('text/')) return '#7F8C8D';  // Gris texte

    return DEFAULT_COLOR;
};