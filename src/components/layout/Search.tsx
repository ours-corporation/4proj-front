"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { searchAPI, SearchParams, SearchResponse } from "@/src/api/search";
import { getFileColor } from "@/src/utils/get-file-color";
import { getFileSvg } from "@/src/utils/get-file-svg";
import { convertFileSize } from "@/src/utils/convert-file-size";

const folderColor = "#F59E0B";

export default function Search() {
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState<Omit<SearchParams, "q">>({
        type: "all",
    });
    const [showFilters, setShowFilters] = useState(false);
    const [results, setResults] = useState<SearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fermer le dropdown si clic extérieur
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setShowFilters(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce de la recherche
    useEffect(() => {
        if (!query.trim()) {
            setResults(null);
            setOpen(false);
            return;
        }
        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await searchAPI({ q: query, ...filters });
                setResults(data);
                setOpen(true);
            } catch {
                setResults(null);
            } finally {
                setLoading(false);
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [query, filters]);

    const totalResults = (results?.files.length ?? 0) + (results?.folders.length ?? 0);

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Barre de recherche */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (results) setOpen(true); }}
                className="block w-full pl-12 pr-10 py-3 bg-input-bg dark:bg-dark-input-bg border-none rounded-full text-txt-secondary dark:text-dark-txt-secondary placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="Rechercher un fichier..."
            />

            {/* Bouton filtres */}
            <button
                onClick={() => setShowFilters((v) => !v)}
                className={`absolute inset-y-0 right-3 flex items-center px-1 text-gray-400 hover:text-txt-primary dark:hover:text-dark-txt-primary transition-colors ${showFilters ? "text-action dark:text-dark-action" : ""}`}
                title="Filtres"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
            </button>

            {/* Panneau filtres */}
            {showFilters && (
                <div className="absolute top-full mt-2 w-full bg-surface dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border-subtle shadow-lg p-4 z-50 flex flex-col gap-3">
                    <p className="text-xs font-semibold text-txt-primary dark:text-dark-txt-primary uppercase tracking-wider">Filtres</p>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Type */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-txt-secondary dark:text-dark-txt-secondary">Type</label>
                            <select
                                value={filters.type ?? "all"}
                                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value as SearchParams["type"] }))}
                                className="bg-input-bg dark:bg-dark-input-bg text-txt-primary dark:text-dark-txt-primary text-sm rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="all">Tout</option>
                                <option value="file">Fichiers</option>
                                <option value="folder">Dossiers</option>
                            </select>
                        </div>

                        {/* Catégorie */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-txt-secondary dark:text-dark-txt-secondary">Catégorie</label>
                            <select
                                value={filters.category ?? ""}
                                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value as SearchParams["category"] || undefined }))}
                                className="bg-input-bg dark:bg-dark-input-bg text-txt-primary dark:text-dark-txt-primary text-sm rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="">Toutes</option>
                                <option value="image">Image</option>
                                <option value="video">Vidéo</option>
                                <option value="audio">Audio</option>
                                <option value="document">Document</option>
                            </select>
                        </div>

                        {/* Taille min */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-txt-secondary dark:text-dark-txt-secondary">Taille min (octets)</label>
                            <input
                                type="number"
                                min={0}
                                value={filters.minSize ?? ""}
                                onChange={(e) => setFilters((f) => ({ ...f, minSize: e.target.value ? Number(e.target.value) : undefined }))}
                                placeholder="Ex: 1024"
                                className="bg-input-bg dark:bg-dark-input-bg text-txt-primary dark:text-dark-txt-primary text-sm rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>

                        {/* Après date */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-txt-secondary dark:text-dark-txt-secondary">Créé après</label>
                            <input
                                type="date"
                                value={filters.after ?? ""}
                                onChange={(e) => setFilters((f) => ({ ...f, after: e.target.value || undefined }))}
                                className="bg-input-bg dark:bg-dark-input-bg text-txt-primary dark:text-dark-txt-primary text-sm rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Corbeille */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.trash ?? false}
                            onChange={(e) => setFilters((f) => ({ ...f, trash: e.target.checked || undefined }))}
                            className="rounded accent-indigo-500"
                        />
                        <span className="text-sm text-txt-secondary dark:text-dark-txt-secondary">Chercher dans la corbeille</span>
                    </label>
                </div>
            )}

            {/* Résultats */}
            {open && !showFilters && (
                <div className="absolute top-full mt-2 w-full bg-surface dark:bg-dark-surface rounded-2xl border border-border-subtle dark:border-dark-border-subtle shadow-lg z-50 overflow-hidden">
                    {loading && (
                        <div className="flex items-center justify-center py-6">
                            <svg className="w-5 h-5 animate-spin text-txt-secondary dark:text-dark-txt-secondary" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                        </div>
                    )}

                    {!loading && totalResults === 0 && (
                        <p className="text-sm text-txt-secondary dark:text-dark-txt-secondary text-center py-6">
                            Aucun résultat pour &quot;{query}&quot;
                        </p>
                    )}

                    {!loading && results && totalResults > 0 && (
                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                            {/* Dossiers */}
                            {results.folders.map((folder) => (
                                <Link
                                    key={`folder-${folder.id}`}
                                    href={`/folders?folderId=${folder.id}`}
                                    onClick={() => { setOpen(false); setQuery(""); }}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-main-bg dark:hover:bg-dark-main-bg transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${folderColor}20`, color: folderColor }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-txt-primary dark:text-dark-txt-primary truncate">{folder.name}</p>
                                        <p className="text-xs text-txt-secondary dark:text-dark-txt-secondary">Dossier</p>
                                    </div>
                                </Link>
                            ))}

                            {/* Fichiers */}
                            {results.files.map((file) => {
                                const color = getFileColor(file.mime_type);
                                const href = file.folder_id ? `/folders?folderId=${file.folder_id}` : "/folders";
                                return (
                                    <Link
                                        key={`file-${file.id}`}
                                        href={href}
                                        onClick={() => { setOpen(false); setQuery(""); }}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-main-bg dark:hover:bg-dark-main-bg transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
                                            <img src={getFileSvg(file.mime_type)} alt={file.mime_type} className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-txt-primary dark:text-dark-txt-primary truncate">{file.fullName}</p>
                                            <p className="text-xs text-txt-secondary dark:text-dark-txt-secondary">{convertFileSize(file.size_bytes)}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
