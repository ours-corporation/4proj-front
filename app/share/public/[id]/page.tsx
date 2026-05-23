import { notFound } from "next/navigation";
import { getPublicShareAPI } from "@/src/api/share";
import ShowPublicShare from "@/src/components/share/ShowPublicShare";

export default async function PublicSharePage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    if (!id || id.trim() === "") {
        notFound();
    }

    const result = await getPublicShareAPI(id);

    if (!result.success && (result.error === "LINK_INVALID")) {
        notFound();
    }

    return <ShowPublicShare shareId={id} initialResult={result} />;
}