'use client';

import React, { useState, useRef, useEffect } from 'react';
import NavItems from "@/src/components/nav/NavItems";
import { useJwtInformation } from "@/src/hooks/getJwtInformation";
import { useRouter } from 'next/navigation';
import { getMyProfilePicture } from '@/src/api/user';
import { logout } from '@/src/api/auth';

const NAV_ITEMS = [
    {
        text: "Dashboard",
        href: "/dashboard",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
        ),
    },
    {
        text: "Mes Fichiers",
        href: "/folders",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
        ),
    },
    {
        text: "Partagés",
        href: "/share",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
        ),
    },
    {
        text: "Corbeille",
        href: "/trash",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
        ),
    },
];

export default function NavBar({ currentPage }: { currentPage: string }) {
    const userInfo = useJwtInformation();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [profilePicture, setProfilePicture] = useState<string>("");

    async function fetchUserProfilePic() {
        try {
            const url = await getMyProfilePicture();
            if (url) setProfilePicture(url);
        } catch (error: any) {
            if (!error?.message?.includes('404')) console.log(error);
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

    useEffect(() => {
        return () => { if (profilePicture) URL.revokeObjectURL(profilePicture); };
    }, [profilePicture]);

    async function handleLogout() {
        try { await logout(); } finally {
            localStorage.removeItem('accessToken');
            sessionStorage.removeItem('accessToken');
            router.push('/login');
        }
    }

    return (
        <aside className="w-60 h-screen flex-shrink-0 bg-surface dark:bg-[#0d0d0d] border-r border-border-subtle dark:border-white/[0.06] flex-col p-4 overflow-y-auto hidden md:flex shadow-sm dark:shadow-none">

            {/* Logo */}
            <a href="/dashboard" className="flex items-center gap-2.5 mb-8 px-2 py-2 no-underline">
                <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="nav-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#7c6ef8" />
                            <stop offset="100%" stopColor="#42aff0" />
                        </linearGradient>
                    </defs>
                    <rect className="fill-surface dark:fill-[#0d0d0d]" stroke="#7c6ef8" strokeWidth="3" x="2" y="2" width="96" height="96" rx="22" ry="22" />
                    <path fill="url(#nav-grad)" d="M72 82H28C16 82 6 73 6 62C6 52 13 43.5 23 41.5C23 30 32 21 44 21C53 21 60.5 26 64 33C66 32.5 68 32 70 32C80 32 88 40 88 50C88 67 81 78 72 82Z" />
                    <polygon className="fill-surface dark:fill-[#0d0d0d]" points="50,30 38,48 45,48 45,62 55,62 55,48 62,48" />
                </svg>
                <span className="text-lg font-bold bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Supfile
                </span>
            </a>

            {/* Section label */}
            <p className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#333] uppercase tracking-widest px-3.5 mb-2">Menu</p>

            {/* Nav items */}
            <nav className="space-y-0.5 mb-auto">
                {NAV_ITEMS.map((item) => (
                    <NavItems
                        key={item.href}
                        text={item.text}
                        href={item.href}
                        isActive={currentPage === item.href}
                        icon={item.icon}
                    />
                ))}
            </nav>

            {/* Profile section */}
            <div className="mt-6 pt-4 border-t border-border-subtle dark:border-white/[0.06] relative" ref={menuRef}>
                {menuOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-[#111113] border border-border-subtle dark:border-white/[0.08] rounded-[14px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                        <a
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-txt-secondary dark:text-[#aaa] hover:text-txt-primary dark:hover:text-[#ededed] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors no-underline"
                            onClick={() => setMenuOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            Mon compte
                        </a>
                        <div className="border-t border-border-subtle dark:border-white/[0.06] mx-3 my-1" />
                        <a
                            href="/cgu"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-txt-secondary dark:text-[#aaa] hover:text-txt-primary dark:hover:text-[#ededed] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors no-underline"
                            onClick={() => setMenuOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            CGU
                        </a>
                        <a
                            href="/mentions-legales"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-txt-secondary dark:text-[#aaa] hover:text-txt-primary dark:hover:text-[#ededed] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors no-underline"
                            onClick={() => setMenuOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                            </svg>
                            Mentions légales
                        </a>
                        <div className="border-t border-border-subtle dark:border-white/[0.06] mx-3 my-1" />
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#ef5350] hover:bg-[#ef5350]/[0.06] dark:hover:bg-white/[0.04] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                            </svg>
                            Déconnexion
                        </button>
                    </div>
                )}

                <button
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-[10px] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                    onClick={() => setMenuOpen(prev => !prev)}
                >
                    {profilePicture ? (
                        <img
                            src={profilePicture}
                            alt="Profil"
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-[#7c6ef8]/30 flex-shrink-0"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#7c6ef8] to-[#42aff0] flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                    )}
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-txt-primary dark:text-[#ccc] truncate">{userInfo?.username}</p>
                        <p className="text-[11px] text-txt-secondary dark:text-[#444] truncate">Mon compte</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-txt-secondary dark:text-[#444] flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    </svg>
                </button>
            </div>
        </aside>
    );
}
