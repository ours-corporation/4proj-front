import { useState, useEffect, useCallback } from 'react';
import { getStorageStats } from '@/src/api/user';
import { StorageCategoryData } from '@/src/interface/storage';
import { useSocketEvent } from '@/src/hooks/useSocketEvent';

const CATEGORY_META: Record<string, { label: string; color: string }> = {
    video:    { label: 'Vidéos',    color: '#C0392B' },
    photo:    { label: 'Images',    color: '#2ECC71' },
    document: { label: 'Documents', color: '#315EFB' },
    other:    { label: 'Autres',    color: '#95A5A6' },
};

const MOCK_CATEGORIES: StorageCategoryData[] = [
    { label: 'Images',    bytes: 2.1 * 1024 ** 3, color: '#2ECC71' },
    { label: 'Vidéos',   bytes: 8.4 * 1024 ** 3, color: '#C0392B' },
    { label: 'Documents', bytes: 1.2 * 1024 ** 3, color: '#315EFB' },
    { label: 'Autres',    bytes: 0.3 * 1024 ** 3, color: '#95A5A6' },
];

const MOCK_TOTAL = 30 * 1024 ** 3;

interface StorageData {
    usedBytes: number;
    totalBytes: number;
    categories: StorageCategoryData[];
    isMock: boolean;
    loading: boolean;
}

export function useStorageData(enabled: boolean = true): StorageData {
    const [usedBytes, setUsedBytes]   = useState(0);
    const [totalBytes, setTotalBytes] = useState(MOCK_TOTAL);
    const [categories, setCategories] = useState<StorageCategoryData[]>([]);
    const [isMock, setIsMock]         = useState(false);
    const [loading, setLoading]       = useState(true);

    const load = useCallback(async () => {
        if (!enabled) return;
        try {
            const stats = await getStorageStats();
            setUsedBytes(stats.used_bytes);
            setTotalBytes(stats.quota_bytes);
            setCategories(
                Object.entries(stats.categories).map(([key, val]) => ({
                    label: CATEGORY_META[key]?.label ?? key,
                    color: CATEGORY_META[key]?.color ?? '#95A5A6',
                    bytes: val.bytes,
                }))
            );
            setIsMock(false);
        } catch {
            setCategories(MOCK_CATEGORIES);
            setIsMock(true);
        } finally {
            setLoading(false);
        }
    }, [enabled]);

    useEffect(() => { load(); }, [load]);

    useSocketEvent('storage:updated', useCallback(() => { load(); }, [load]));

    return { usedBytes, totalBytes, categories, isMock, loading };
}
