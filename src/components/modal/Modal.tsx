import React, { useEffect, useState } from 'react';

interface ModalProps {
    size?: 'small' | 'medium' | 'large';
    isOpen: boolean;
    title?: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const sizeMap = { small: 'max-w-md', medium: 'max-w-2xl', large: 'max-w-4xl' };

export default function Modal({ size = 'medium', isOpen, title, children, onClose }: ModalProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
            document.body.style.overflow = 'hidden';
        } else {
            const t = setTimeout(() => setShow(false), 200);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    if (!show && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
        >
            <div
                className={`bg-[#111113] border border-white/[0.08] rounded-[20px] shadow-[0_40px_80px_rgba(0,0,0,0.7)] w-full ${sizeMap[size]} overflow-hidden transform transition-all duration-200 ${
                    isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    {title && (
                        <h2 className="text-[15px] font-semibold text-[#ededed] tracking-tight line-clamp-1">
                            {title}
                        </h2>
                    )}
                    <button
                        onClick={onClose}
                        className="ml-auto p-1.5 text-[#555] hover:text-[#ededed] hover:bg-white/[0.06] rounded-[8px] transition-colors"
                        aria-label="Fermer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
