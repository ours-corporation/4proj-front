import React from 'react';

interface NavItemsProps {
    text: string;
    href: string;
    icon: React.ReactNode;
    isActive?: boolean;
}

export default function NavItems({ text, href, icon, isActive = false }: NavItemsProps) {
    // Styles pour l'élément actif (Le gros bouton bleu)
    const activeStyle = "bg-action dark:bg-dark-action text-white shadow-lg shadow-blue-900/20 font-semibold";

    // Styles pour les éléments inactifs (Gris, hover léger)
    const inactiveStyle = "text-txt-secondary hover:text-txt-primary hover:bg-gray-200 dark:hover:bg-white/5";

    return (
        <a
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? activeStyle : inactiveStyle}`}
        >
            {/* On clone l'icône pour s'assurer qu'elle a la bonne taille */}
            <div className="w-6 h-6 flex-shrink-0">
                {icon}
            </div>
            <span className="text-sm font-medium">{text}</span>
        </a>
    );
}