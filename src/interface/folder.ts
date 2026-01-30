export interface FolderResponse {
    id: number;
    user_id: number;
    parent_id: number | null;
    name: string;
    trashed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface FolderShareResponse {
    id: number;
    name: string;
    user_id: number;
    parent_id: number | null;
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