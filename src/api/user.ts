import { authFetch } from "@/src/api/authFetch";
import { User } from "@/src/interface/user";
import { StorageStats } from "@/src/interface/storage";

export async function getMyInformation() {
    try {
        const rep = await authFetch(`/api/users/me?quota=true`, {
            headers: { "Content-Type": "application/json" },
        });
        if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
        return rep.json() as Promise<User>;
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des informations utilisateur : ${error}`);
    }
}

export async function updateUser(newUsername: string, newEmail: string, password?: string) {
    const body: Record<string, string> = { username: newUsername, email: newEmail };
    if (password) body.password = password;

    const rep = await authFetch(`/api/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!rep.ok) {
        const data = await rep.json().catch(() => ({}));
        throw new Error(data.message || `Erreur HTTP: ${rep.status}`);
    }

    return rep.json();
}

export async function updatePassword(oldPassword: string, newPassword: string) {
    const rep = await authFetch(`/api/users/me/update-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastPassword: oldPassword, NewPassword: newPassword }),
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json() as Promise<User>;
}

export async function getMyProfilePicture(_qualityValue?: string) {
    const rep = await authFetch(`/api/users/me/profile-picture`);
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return URL.createObjectURL(await rep.blob());
}

export async function updateProfilePicture(profilePicture: File) {
    const formData = new FormData();
    formData.append('file', profilePicture);

    const rep = await authFetch(`/api/users/me/profile-picture`, {
        method: "PUT",
        body: formData,
    });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json() as Promise<string>;
}

export async function deleteAccount(): Promise<void> {
    const rep = await authFetch(`/api/users/me`, { method: 'DELETE' });
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
}

export async function deleteProfilePicture(): Promise<void> {
    const rep = await authFetch(`/api/users/me/profile-picture`, { method: 'DELETE' });
    if (!rep.ok && rep.status !== 404) throw new Error(`Erreur HTTP: ${rep.status}`);
}

export async function getStorageStats(): Promise<StorageStats> {
    const rep = await authFetch(`/api/users/me/storage`);
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
    return rep.json();
}

export async function downloadGdprExport(): Promise<void> {
    const rep = await authFetch(`/api/users/me/data-export`);
    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);

    const blob = await rep.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `supfile-data-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(objectUrl);
}
