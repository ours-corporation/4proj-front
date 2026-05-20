import React from 'react';

interface GlobalCardProps {
    children: React.ReactNode;
    svgIcon?: React.ReactNode;
    iconBg?: string;
}

export default function GlobalCard({ children, svgIcon, iconBg }: GlobalCardProps) {
    return (
        <div className="w-full bg-[#111113] border border-white/[0.06] p-6 rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
            {svgIcon && (
                <div className={`h-10 w-10 rounded-[10px] flex items-center justify-center mb-5 ${iconBg ?? "bg-[#7c6ef8]/10"}`}>
                    {svgIcon}
                </div>
            )}
            {children}
        </div>
    );
}
