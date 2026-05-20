export interface StorageCategoryData {
    label: string;
    bytes: number;
    color: string;
}

interface StorageCategoryStats {
    bytes: number;
    percent: number;
}

export interface StorageStats {
    quota_bytes: number;
    used_bytes: number;
    free_bytes: number;
    used_percent: number;
    free_percent: number;
    categories: {
        video:    StorageCategoryStats;
        photo:    StorageCategoryStats;
        document: StorageCategoryStats;
        other:    StorageCategoryStats;
    };
}
