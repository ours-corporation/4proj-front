import { getPublicShareAPI } from '@/src/api/share';
import Modal from "@/src/components/modal/Modal";
// Importe ici tes composants de vue (ex: un formulaire de mot de passe)
// import PasswordForm from "@/src/components/share/PasswordForm";

export default async function PublicSharePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // On appelle l'API (sans password au premier chargement)
    const response = await getPublicShareAPI(id);

    // --- CAS 1 : Lien Introuvable ou Expiré (404 / 410) ---
    if (!response.success && response.error === "LINK_INVALID") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-600">Lien non disponible</h1>
                <p>Ce lien est invalide ou a expiré.</p>
            </div>
        );
    }

    if (!response.success && response.error === "PASSWORD_REQUIRED") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-xl font-semibold">Contenu protégé</h1>
                <p>Veuillez saisir le mot de passe pour accéder à ce partage.</p>
                {/* Ici, tu afficherais un composant Client (formulaire)
                   qui rappellera getPublicShareAPI avec le password
                */}
                <div className="mt-4">
                    <input type="password" placeholder="Mot de passe" className="border p-2 rounded" />
                    <button className="ml-2 bg-blue-500 text-white p-2 rounded">Valider</button>
                </div>
            </div>
        );
    }

    if(response.success) {

        return (
            <div className="p-8">
                dhyureghioe
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold text-red-600">Erreur inconnue</h1>
            <p>Une erreur inattendue est survenue. Veuillez réessayer plus tard.</p>
        </div>
    );
}