export interface PublicShareResponse {
    error: string;
    protected: boolean;
    type: string;
    owner: string;
    permission: 'READ' | 'WRITE';
    data: PublicShareData;
}

export interface PublicShareData {
    id: number;
    name: string;
    extension?: string;
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
}