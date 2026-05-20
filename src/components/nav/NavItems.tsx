import React from 'react';

interface NavItemsProps {
    text: string;
    href: string;
    icon: React.ReactNode;
    isActive?: boolean;
}

export default function NavItems({ text, href, icon, isActive = false }: NavItemsProps) {
    const activeStyle = "bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white shadow-[0_4px_20px_rgba(124,110,248,0.25)] font-semibold";
    const inactiveStyle = "text-txt-secondary dark:text-[#555] hover:text-txt-primary dark:hover:text-[#ededed] hover:bg-black/[0.05] dark:hover:bg-white/[0.04]";

    return (
        <a
            href={href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] transition-all duration-200 ${isActive ? activeStyle : inactiveStyle}`}
        >
            <div className="w-5 h-5 flex-shrink-0">
                {icon}
            </div>
            <span className="text-sm font-medium">{text}</span>
        </a>
    );
}
