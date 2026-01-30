import React, { useEffect, useState } from 'react';

interface ModalProps {
    size?: 'small' | 'medium' | 'large';
    isOpen: boolean;
    title?: string;
    children?: React.ReactNode;
    onClose: () => void;
}

export default function Modal({ size, isOpen, title, children, onClose }: ModalProps) {
    const [show, setShow] = useState(false);
    const [ tailwindSizeClass, setTailwindSizeClass ] = useState('max-w-3xl');

    useEffect(() => {
        if(size) {
            switch(size) {
                case 'small':
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setTailwindSizeClass('max-w-md');
                    break;
                case 'medium':
                    setTailwindSizeClass('max-w-3xl');
                    break;
                case 'large':
                    setTailwindSizeClass('max-w-5xl');
                    break;
                default:
                    setTailwindSizeClass('max-w-3xl');
            }
        }

        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShow(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setShow(false), 200); // Délai pour l'animation de sortie
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!show && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
                isOpen ? 'bg-black/20 backdrop-blur-sm opacity-100' : 'bg-black/0 opacity-0'
            }`}
            onClick={onClose}
        >
            <div
                className={`bg-surface dark:bg-dark-surface rounded-2xl shadow-2xl w-full ${tailwindSizeClass} overflow-hidden transform transition-all duration-300 ${
                    isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    {title && (
                        <h2 className="text-lg font-bold text-txt-primary dark:text-dark-txt-primary tracking-tight line-clamp-1">
                            {title}
                        </h2>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 text-txt-primary hover:bg-border-subtle dark:text-dark-txt-primary dark:hover:bg-dark-main-bg rounded-full transition-colors"
                        aria-label="Fermer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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