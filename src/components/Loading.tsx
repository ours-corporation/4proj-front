import React from "react";

export default function Loading() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-main-bg dark:bg-[#0d0d0d]">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-border-subtle dark:border-white/[0.06]"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#7c6ef8] border-r-[#42aff0] animate-spin"></div>
            </div>
            <p className="mt-4 text-sm text-txt-secondary dark:text-dark-txt-secondary">Chargement...</p>
        </div>
    );
}
