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