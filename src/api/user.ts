import { getJwtToken } from "@/src/hooks/getJwtInformation";

import { User } from "@/src/interface/user";

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

export async function updateUser(newUsername: string, newEmail: string) {
    try {
        const url = process.env.NEXT_PUBLIC_API_URL

        const rep = await fetch( url + "/api/users/me", {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJwtToken()}`,
            },
            body: JSON.stringify({username: newUsername, email: newEmail})
        });
        console.log(JSON.stringify({user : newUsername, email: newEmail}));
        if (rep.ok) {
            const data: User = await rep.json();
            console.log(data);
            return data;
        } else {
            throw new Error(`Erreur lors de la récupération des informations utilisateur : ${rep.status}`);
        }
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des informations utilisateur : ${error}`);

    }
}