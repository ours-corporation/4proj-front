'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('light');

    //récupère le thème par défault

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        if (storedTheme) {
            setTheme(storedTheme);
            //ajoute la classe dark à la balise html
            document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
            document.documentElement.classList.toggle('dark', prefersDark);
        }
    }, []);

    // fonction permettant d'alterner le thème clair et sombre

    const toggleTheme = () => {
        const newTheme = theme == 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme == 'dark');
    };
    return { theme, toggleTheme };
}
