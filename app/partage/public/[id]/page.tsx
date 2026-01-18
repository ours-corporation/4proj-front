export default function PublicSharePage({ params }: { params: { id: string } }) {
    return (
        <div>
            <h1>Page de partage publique</h1>
            <p>L'identifiant récupéré est : {params.id}</p>
        </div>
    );
}