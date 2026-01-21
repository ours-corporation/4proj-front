// 1. Ajoutez 'async' à la fonction
// 2. Mettez à jour le type pour indiquer que params est une Promise
export default async function PublicSharePage({params}: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    console.log("je suis la");
    console.log(resolvedParams.id);

    return (
        <div>
            <h1>Page de partage publique</h1>
            <p>L'identifiant récupéré est : {resolvedParams.id}</p>
        </div>
    );
}