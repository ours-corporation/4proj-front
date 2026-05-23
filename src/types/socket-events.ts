export interface FilePayload {
    id: number;
    name: string;
    extension: string | null;
    size_bytes: number;
    mime_type: string;
    folder_id: number | null;
    user_id: number;
    created_at?: string;
    updated_at?: string;
}

export interface FolderPayload {
    id: number;
    name: string;
    parent_id: number | null;
    user_id: number;
    created_at?: string;
    updated_at?: string;
}

export interface SharePayload {
    id: number;
    owner_id: number;
    file_id: number | null;
    folder_id: number | null;
    recipient_id: number | null;
    token: string | null;
    permission: 'READ' | 'WRITE';
    expires_at: string | null;
}

export interface StoragePayload {
    used_bytes: number;
}

export interface ServerToClientEvents {
    'file:created': (payload: FilePayload) => void;
    'file:updated': (payload: FilePayload) => void;
    'file:trashed': (payload: { id: number }) => void;
    'file:restored': (payload: FilePayload) => void;
    'file:deleted': (payload: { id: number }) => void;
    'folder:created': (payload: FolderPayload) => void;
    'folder:updated': (payload: FolderPayload) => void;
    'folder:trashed': (payload: { id: number }) => void;
    'folder:restored': (payload: FolderPayload) => void;
    'folder:deleted': (payload: { id: number }) => void;
    'trash:emptied': (payload: Record<string, never>) => void;
    'items:moved': (payload: { items: Array<{ type: string; id: number }>; destination_folder_id: number | null }) => void;
    'share:created': (payload: SharePayload) => void;
    'share:received': (payload: SharePayload) => void;
    'share:updated': (payload: SharePayload) => void;
    'share:revoked': (payload: { id: number }) => void;
    'storage:updated': (payload: StoragePayload) => void;
}

export interface ClientToServerEvents {
    // clients are read-only via socket
}
