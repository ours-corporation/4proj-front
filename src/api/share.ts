import {getJwtToken} from "@/src/hooks/getJwtInformation";

export async function createPublicShare(fileId?: number, folderId?: number, password?: string, expiresAt?: string) : Promise<Response> {
    const url = process.env.NEXT_PUBLIC_API_URL
    const token = getJwtToken();

    return await fetch( url + "/api/shares/public", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ fileId : fileId, folderId : folderId, password : password, expiresAt : expiresAt }),
    });


}