import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function converCreatedAt(dateStr: string) {
    const date = new Date(dateStr);
    return formatDistanceToNow(date, {
        addSuffix: true,
        includeSeconds: true,
        locale: fr
    });
}