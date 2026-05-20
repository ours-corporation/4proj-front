import React from 'react';

import NavItems from './NavItems';
import {logout} from '@/src/api/auth'
import {useRouter} from "next/navigation";

interface LogoutButtonProps {
    isActive?: boolean;
}

export default function LogoutButton({isActive = false}:LogoutButtonProps){
    const router = useRouter();

     // Styles pour l'élément actif (Le gros bouton bleu)
    const activeStyle = "bg-action dark:bg-dark-action text-white shadow-lg shadow-blue-900/20 font-semibold";

    // Styles pour les éléments inactifs (Gris, hover léger)
    const inactiveStyle = "text-txt-secondary hover:text-txt-primary hover:bg-white/5";

    const handleLogout = async () => {
        try {
        const rep = await logout();
        if (rep.status == 200){
            console.log(rep.status);
            localStorage.removeItem("accessToken");
            sessionStorage.removeItem("accessToken");
            router.replace("/login");
        }
        } catch (err) {
        console.error(err);
        alert("Erreur lors de la déconnexion");
        }
    };
    return (
        
            <button onClick={handleLogout} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? activeStyle : inactiveStyle}`}> 
                <div className="w-6 h-6 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>
                </div>
                <span className="text-sm font-medium">Déconnexion</span>
           
            </button>
        
    );
}