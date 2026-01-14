import React from "react";

export default function Loading() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-white text-slate-800">
            <div className="w-12 h-12 border-4 border-slate-300 border-t-sky-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-slate-500">Chargement...</p>
        </div>
    );
}
