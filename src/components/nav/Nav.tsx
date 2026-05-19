import React, { useState, useRef, useEffect } from 'react';
import NavItems from "@/src/components/nav/NavItems";
import {useJwtInformation} from "@/src/hooks/getJwtInformation";
import { useRouter } from 'next/navigation';

import { getMyProfilePicture } from '@/src/api/user';
import { logout } from '@/src/api/auth';

export default function NavBar({ currentPage }: { currentPage: string }) {
    const userInfo = useJwtInformation();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [profilePicture, setProfilePicture] = useState<string>("");


    async function fetchUserProfilePic(){
        try{
            const url = await getMyProfilePicture();
            if (url) {
                setProfilePicture(url);
            }
        } catch (error: any) {
            if (!error?.message?.includes('404')) {
                console.log(error);
            }
            setProfilePicture("");
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchUserProfilePic();
        window.addEventListener('profile-picture-updated', fetchUserProfilePic);
        return () => window.removeEventListener('profile-picture-updated', fetchUserProfilePic);
    }, []);

    useEffect (()=> {
        return () => {
            if (profilePicture) {
                URL.revokeObjectURL(profilePicture);
            }
        };
    }, [profilePicture])

    async function handleLogout() {
        try {
            await logout();
        } finally {
            localStorage.removeItem('accessToken');
            sessionStorage.removeItem('accessToken');
            router.push('/login');
        }
    }

    return (
        <aside className="w-64 h-screen flex-shrink-0 bg-surface dark:bg-dark-surface border-r border-main-bg dark:border-dark-main-bg flex-col p-4 overflow-y-auto hidden md:flex">
            <h1>
                <a href="/dashboard" className="flex items-center gap-3 mb-6 px-4 py-3">
                    <img src="/logo-light.svg" alt="SupFile" className="w-15 h-15 rounded-xl shrink-0 dark:hidden" />
                    <img src="/logo-dark.svg" alt="SupFile" className="w-15 h-15 rounded-xl shrink-0 hidden dark:block" />
                    <span className="text-2xl font-bold text-txt-primary dark:text-dark-txt-primary">SupFile</span>
                </a>
            </h1>

            {/* SECTION: MENU */}
            <div className="mb-2 px-4 mt-4">
                <span className="text-xs font-bold text-txt-secondary dark:text-dark-txt-secondary tracking-wider uppercase">Menu</span>
            </div>

            <nav className="space-y-1 mb-8">
                <NavItems
                    text="Dashboard"
                    href="/dashboard"
                    isActive={currentPage === '/dashboard'}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                        </svg>
                    }
                />

                <NavItems
                    text="Mes Fichiers"
                    href="/folders"
                    isActive={currentPage === '/folders'}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                        </svg>
                    }
                />

                <NavItems
                    text="Partagés"
                    href="/share"
                    isActive={currentPage === '/share'}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                    }
                />

                <NavItems
                    text="Corbeille"
                    href="/trash"
                    isActive={currentPage === '/trash'}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                        </svg>
                    }
                />
            </nav>

            <button className="mt-auto pt-4 border-t border-txt-secondary dark:border-dark-txt-secondary relative" >
                {menuOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-surface dark:bg-dark-surface border border-main-bg dark:border-dark-main-bg rounded-xl shadow-lg overflow-hidden z-50">
                        <a
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-txt-primary dark:text-dark-txt-primary hover:bg-main-bg dark:hover:bg-dark-main-bg transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            Mon compte
                        </a>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-main-bg dark:hover:bg-dark-main-bg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                            </svg>
                            Déconnexion
                        </button>
                    </div>
                )}
                <button
                    className="flex items-center gap-3 px-4 py-3 w-full hover:bg-main-bg dark:hover:bg-dark-main-bg rounded-xl transition-colors"
                    onClick={() => setMenuOpen(prev => !prev)}
                >
                    {profilePicture ? 
                    <img
                        className="h-10 w-10 rounded-full border-2 border-transparent hover:border-action dark:hover:border-dark-action transition-all cursor-pointer object-cover"
                        src= {profilePicture}     
                        alt="image de profil"
                    /> : 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10 rounded-full border-2 border-transparent hover:border-action dark:hover:border-dark-action transition-all cursor-pointer object-cover">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-txt-secondary dark:text-dark-txt-secondary truncate">{userInfo.username}</p>
                    </div>
                </button>
            </button>
        </aside>
    );
}