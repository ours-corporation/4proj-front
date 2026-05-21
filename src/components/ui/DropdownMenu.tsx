'use client';

import React, { useEffect, useRef } from 'react';

export interface MenuItem {
    label: string;
    onClick: () => void;
    danger?: boolean;
    success?: boolean;
    icon?: React.ReactNode;
}

interface DropdownMenuProps {
    items: MenuItem[];
    onClose: () => void;
}

export function DropdownMenu({ items, onClose }: DropdownMenuProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-[#111113] border border-border-subtle dark:border-white/[0.08] rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-30 py-1"
        >
            {items.map((item, i) => (
                <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); item.onClick(); onClose(); }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center gap-2.5 ${
                        item.danger
                            ? 'text-[#ef5350] hover:bg-[#ef5350]/[0.08]'
                            : item.success
                            ? 'text-[#4CAF50] hover:bg-[#4CAF50]/[0.08]'
                            : 'text-txt-secondary dark:text-[#aaa] hover:text-txt-primary dark:hover:text-[#ededed] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                    }`}
                >
                    {item.icon && <span className="w-4 h-4 flex-shrink-0 opacity-70">{item.icon}</span>}
                    {item.label}
                </button>
            ))}
        </div>
    );
}
