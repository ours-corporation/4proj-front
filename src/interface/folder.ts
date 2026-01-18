export interface FolderResponse {
    id: number;
    user_id: number;
    parent_id: number | null;
    name: string;
    trashed_at: string | null;
    createdAt: string;
    updatedAt: string;
}