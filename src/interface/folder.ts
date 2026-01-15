export interface FolderResponse {
    id: number;
    user_id: number;
    parent_id: number | null;
    name: string;
    trashed_at: string | null;
    created_at: string;
    updated_at: string;
}