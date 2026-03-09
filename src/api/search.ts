import { getJwtToken } from "@/src/hooks/getJwtInformation";
import { FileResponse } from "@/src/interface/file";
import { FolderResponse } from "@/src/interface/folder";

export interface SearchParams {
    q: string;
    trash?: boolean;
    type?: "all" | "file" | "folder";
    category?: "image" | "video" | "audio" | "document";
    minSize?: number;
    after?: string;
}

export interface SearchResponse {
    files: FileResponse[];
    folders: FolderResponse[];
}

export async function searchAPI(params: SearchParams): Promise<SearchResponse> {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = getJwtToken();

    const query = new URLSearchParams();
    query.set("q", params.q);
    if (params.trash !== undefined) query.set("trash", String(params.trash));
    if (params.type) query.set("type", params.type);
    if (params.category) query.set("category", params.category);
    if (params.minSize !== undefined) query.set("minSize", String(params.minSize));
    if (params.after) query.set("after", params.after);

    const rep = await fetch(`${url}/api/search?${query.toString()}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!rep.ok) {
        throw new Error(`Erreur HTTP: ${rep.status}`);
    }

    return rep.json();
}
