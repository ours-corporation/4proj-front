import React, {useEffect, useState} from 'react';

export default function Headers() {

    // Recup l'info si il est en mode sombre ou pas
    const [darkMode, setDarkMode] = useState(false);

    // 1. Au chargement : Vérifier les préférences utilisateur (LocalStorage ou Système)
    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

        setDarkMode(isDark);

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // 2. La fonction de bascule (Toggle)
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);

        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <header className="flex items-center justify-between w-full px-8 py-5 bg-[#0b0e1e]">
            {/* Partie Gauche : Barre de recherche */}
            <div className="flex-1 max-w-xl relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {/* Placeholder pour une icone de loupe si besoin */}
                    <div className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-3 bg-[#161b2e] border-none rounded-full text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    placeholder="Rechercher un fichier..."
                />
            </div>

            {/* Partie Droite : Actions et Profil */}
            <div className="flex items-center space-x-8 ml-4">
                <button
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-gray-800"
                    onClick={toggleDarkMode}
                    title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
                >
                    {/* Changement dynamique de l'icône (Soleil vs Lune) */}
                    <span className="material-icons">
                        {darkMode ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>
            </div>
        </header>
    );
}