import { getJwtToken } from "@/src/hooks/getJwtInformation";

import { User } from "@/src/interface/user";
import { StorageStats } from "@/src/interface/storage";

export async function getMyInformation() {
    try {
        const url = process.env.NEXT_PUBLIC_API_URL

        const rep = await fetch( url + "/api/users/me?quota=true", {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        });

        if (rep.ok) {
            const data: User = await rep.json();
            return data;
        } else {
            throw new Error(`Erreur lors de la récupération des informations utilisateur : ${rep.status}`);
        }
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des informations utilisateur : ${error}`);

    }
}

export async function updateUser(newUsername: string, newEmail: string, password?: string) {
    const url = process.env.NEXT_PUBLIC_API_URL;

    const body: Record<string, string> = { username: newUsername, email: newEmail };
    if (password) body.password = password;

    const rep = await fetch(url + "/api/users/me", {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getJwtToken()}`,
        },
        body: JSON.stringify(body),
    });

    if (!rep.ok) {
        const data = await rep.json().catch(() => ({}));
        throw new Error(data.message || `Erreur HTTP: ${rep.status}`);
    }

    return rep.json();
}

export async function updatePassword(oldPassword: string, newPassword: string) {
    try {
        const url = process.env.NEXT_PUBLIC_API_URL

        const rep = await fetch( url + "/api/users/me/update-password", {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJwtToken()}`,
            },
            body: JSON.stringify({lastPassword: oldPassword, NewPassword: newPassword})
        });
        if (rep.ok) {
            const data: User = await rep.json();
            return data;
        } else {
            const errorData = await rep.json();
            console.error("Erreur backend :", errorData);
            throw new Error(`Erreur lors de la récupération des informations utilisateur : ${rep.status}`);
        }
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des informations utilisateur : ${error}`);

    }
}

export async function getMyProfilePicture(qualityValue?:string) {
    try {
        const url = process.env.NEXT_PUBLIC_API_URL

        const rep = await fetch( url + "/api/users/me/profile-picture", {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "image/webP",
                "Authorization": `Bearer ${getJwtToken()}`,
            },
        });

        if (rep.ok) {
            const blob = await rep.blob();
            return URL.createObjectURL(blob);
        } else {
            throw new Error(`Erreur lors de la récupération des informations utilisateur : ${rep.status}`);
        }
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des informations utilisateur : ${error}`);

    }
}


export async function updateProfilePicture(profilePicture:File) {
    try {
        const url = process.env.NEXT_PUBLIC_API_URL

        const formData = new FormData();
        formData.append('file', profilePicture);

        const rep = await fetch( url + "/api/users/me/profile-picture", {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Authorization": `Bearer ${getJwtToken()}`,
            },
            body: formData,
        });
        if (rep.ok) {
            const data: string = await rep.json();
            return data;
        } else {
            const errorData = await rep.json();
            console.error("Erreur backend :", errorData);
            throw new Error(`Erreur lors de la récupération des informations utilisateur : ${rep.status}`);
        }
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des informations utilisateur : ${error}`);

    }
}

export async function deleteAccount(): Promise<void> {
    const url = process.env.NEXT_PUBLIC_API_URL;

    const rep = await fetch(`${url}/api/users/me`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { Authorization: `Bearer ${getJwtToken()}` },
    });

    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);
}

export async function deleteProfilePicture(): Promise<void> {
    const url = process.env.NEXT_PUBLIC_API_URL;

    const rep = await fetch(`${url}/api/users/me/profile-picture`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getJwtToken()}` },
    });

    if (!rep.ok && rep.status !== 404) throw new Error(`Erreur HTTP: ${rep.status}`);
}

export async function getStorageStats(): Promise<StorageStats> {
    const url   = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    const rep = await fetch(`${url}/api/users/me/storage`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!rep.ok) throw new Error(`Erreur HTTP: ${rep.status}`);

    return rep.json();
}