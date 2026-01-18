export interface FileResponse {
    id: number;
    user_id: number;
    folder_id: number | null;
    name: string;
    physical_key: string;
    size_bytes: number;
    mime_type: string;
    trashed_at: string | null;
    deleted_at: string | null;
    createdAt: string;
    updatedAt: string;
}