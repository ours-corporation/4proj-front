'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
    anchorRef?: React.RefObject<HTMLElement | null>;
}

export function DropdownMenu({ items, onClose, anchorRef }: DropdownMenuProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

    useEffect(() => {
        if (anchorRef?.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 4,
                left: rect.right,
            });
        }
    }, [anchorRef]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                ref.current && !ref.current.contains(e.target as Node) &&
                (!anchorRef?.current || !anchorRef.current.contains(e.target as Node))
            ) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, anchorRef]);

    const menuContent = (
        <div
            ref={ref}
            className="w-44 bg-white dark:bg-[#111113] border border-border-subtle dark:border-white/[0.08] rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden py-1"
            style={coords ? {
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                transform: 'translateX(-100%)',
                zIndex: 9999,
            } : {}}
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

    // Portal mode: anchorRef provided, position relative to viewport
    if (anchorRef) {
        if (!coords) return null;
        return createPortal(menuContent, document.body);
    }

    // Fallback: classic absolute positioning (no anchorRef)
    return (
        <div
            ref={ref}
            className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-[#111113] border border-border-subtle dark:border-white/[0.08] rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-50 py-1"
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
