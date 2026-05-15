import React from 'react';

interface GlobalCardProps {
    children: React.ReactNode;
    title?: string;
    svgIcon?: React.ReactNode;
    iconBg?: string;
}

export default function GlobalCard({
    children,
    svgIcon,
    iconBg = "bg-[#7c6ef815] dark:bg-[#9b8ffa15]",
}: GlobalCardProps) {
    // Valeurs simulées pour correspondre à l'image
    return (
        // Conteneur Principal : Fond gris foncé, coins arrondis larges (rounded-3xl), ombre légère
        <div className="w-full bg-surface dark:bg-dark-surface p-6 rounded-[30px] shadow-xl text-white font-sans">

            {/* En-tête : Icône et Menu */}
            <div className="flex justify-between items-start mb-5">
                {/* Boite de l'icône : Fond légèrement plus clair avec teinte bleutée */}
                <div className={`h-12 w-12 ${iconBg} rounded-2xl flex items-center justify-center`}>
                    {svgIcon ? svgIcon : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"/>
                        </svg>

                    )}
                </div>

                {/* Bouton Menu (3 points) */}
                <button className="text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>

            {children}
        </div>
    );
}