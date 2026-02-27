export interface FileResponse {
    // --- Champs Communs ---
    id: number;
    name: string;
    extension: string;
    fullName: string;
    size_bytes: number;
    mime_type: string;
    physical_key: string;
    user_id: number;
    folder_id: number | null;
    trashed_at: string | null;
    deletion_id: number | null;
    createdAt: string;
    updatedAt: string;

    share_id?: number;
    permission?: 'READ' | 'WRITE';
    owner?: {
        id: number;
        username: string;
        email: string;
    };
}

export interface FileShareResponse {
    id: number;
    name: string;
    extension: string;
    fullName: string;
    size_bytes: number;
    mime_type: string;
    physical_key: string;
    user_id: number;
    folder_id: number | null;
    trashed_at: string | null;
    deletion_id: number | null;
    createdAt: string;
    updatedAt: string;
    share_id: number;
    permission: 'READ' | 'WRITE';
    owner: {
        id: number;
        username: string;
        email: string;
    };
}