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
    const [filters, setFilters] = useState<Omit<SearchParams, "q">>({ type: "all" });
    const [showFilters, setShowFilters] = useState(false);
    const [results, setResults] = useState<SearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (!query.trim()) { setResults(null); setOpen(false); return; }
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

    const selectClass = "bg-input-bg dark:bg-[#1a1a1a] text-txt-primary dark:text-[#ccc] text-sm rounded-[8px] px-3 py-2 border border-border-subtle dark:border-white/[0.06] focus:ring-1 focus:ring-[#7c6ef8]/50 focus:outline-none w-full";

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Search input */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (results) setOpen(true); }}
                className="block w-full pl-10 pr-10 py-2.5 bg-surface dark:bg-[#111113] border border-border-subtle dark:border-white/[0.06] rounded-[10px] text-txt-primary dark:text-[#ccc] placeholder-[#9CA3AF] dark:placeholder-[#333] text-sm focus:ring-1 focus:ring-[#7c6ef8]/40 focus:border-[#7c6ef8]/40 focus:outline-none transition-all"
                placeholder="Rechercher un fichier ou dossier…"
            />

            {/* Filter toggle */}
            <button
                onClick={() => setShowFilters((v) => !v)}
                className={`absolute inset-y-0 right-3 flex items-center px-1 transition-colors ${showFilters ? "text-[#7c6ef8]" : "text-txt-secondary dark:text-[#444] hover:text-txt-primary dark:hover:text-[#888]"}`}
                title="Filtres"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
            </button>

            {/* Filters panel */}
            {showFilters && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-[#111113] border border-border-subtle dark:border-white/[0.08] rounded-[14px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-4 z-50 flex flex-col gap-3">
                    <p className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#444] uppercase tracking-widest">Filtres</p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] text-txt-secondary dark:text-[#555]">Type</label>
                            <select
                                value={filters.type ?? "all"}
                                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value as SearchParams["type"] }))}
                                className={selectClass}
                            >
                                <option value="all">Tout</option>
                                <option value="file">Fichiers</option>
                                <option value="folder">Dossiers</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] text-txt-secondary dark:text-[#555]">Catégorie</label>
                            <select
                                value={filters.category ?? ""}
                                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value as SearchParams["category"] || undefined }))}
                                className={selectClass}
                            >
                                <option value="">Toutes</option>
                                <option value="image">Image</option>
                                <option value="video">Vidéo</option>
                                <option value="audio">Audio</option>
                                <option value="document">Document</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] text-txt-secondary dark:text-[#555]">Taille min (octets)</label>
                            <input
                                type="number"
                                min={0}
                                value={filters.minSize ?? ""}
                                onChange={(e) => setFilters((f) => ({ ...f, minSize: e.target.value ? Number(e.target.value) : undefined }))}
                                placeholder="Ex: 1024"
                                className={selectClass}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] text-txt-secondary dark:text-[#555]">Créé après</label>
                            <input
                                type="date"
                                value={filters.after ?? ""}
                                onChange={(e) => setFilters((f) => ({ ...f, after: e.target.value || undefined }))}
                                className={selectClass}
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.trash ?? false}
                            onChange={(e) => setFilters((f) => ({ ...f, trash: e.target.checked || undefined }))}
                            className="rounded accent-[#7c6ef8]"
                        />
                        <span className="text-sm text-txt-secondary dark:text-[#666]">Chercher dans la corbeille</span>
                    </label>
                </div>
            )}

            {/* Results dropdown */}
            {open && !showFilters && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-[#111113] border border-border-subtle dark:border-white/[0.08] rounded-[14px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
                    {loading && (
                        <div className="flex items-center justify-center py-6">
                            <svg className="w-5 h-5 animate-spin text-txt-secondary dark:text-[#444]" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                        </div>
                    )}

                    {!loading && totalResults === 0 && (
                        <p className="text-sm text-txt-secondary dark:text-[#555] text-center py-6">
                            Aucun résultat pour &quot;{query}&quot;
                        </p>
                    )}

                    {!loading && results && totalResults > 0 && (
                        <div className="max-h-80 overflow-y-auto divide-y divide-border-subtle dark:divide-white/[0.04]">
                            {results.folders.map((folder) => (
                                <Link
                                    key={`folder-${folder.id}`}
                                    href={filters.trash ? `/trash` : `/folders?folderId=${folder.id}`}
                                    onClick={() => { setOpen(false); setQuery(""); }}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors no-underline"
                                >
                                    <div className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${folderColor}18`, color: folderColor }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-txt-primary dark:text-[#ccc] truncate">{folder.name}</p>
                                        <p className="text-xs text-txt-secondary dark:text-[#555]">Dossier</p>
                                    </div>
                                </Link>
                            ))}

                            {results.files.map((file) => {
                                const color = getFileColor(file.mime_type);
                                const href = filters.trash ? `/trash` : file.folder_id ? `/folders?folderId=${file.folder_id}` : "/folders";
                                return (
                                    <Link
                                        key={`file-${file.id}`}
                                        href={href}
                                        onClick={() => { setOpen(false); setQuery(""); }}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors no-underline"
                                    >
                                        <div className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
                                            <img src={getFileSvg(file.mime_type)} alt={file.mime_type} className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-txt-primary dark:text-[#ccc] truncate">{file.fullName}</p>
                                            <p className="text-xs text-txt-secondary dark:text-[#555]">{convertFileSize(file.size_bytes)}</p>
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
