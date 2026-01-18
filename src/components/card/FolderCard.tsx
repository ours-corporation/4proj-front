import React from 'react';
import { FolderResponse } from "@/src/interface/folder";
import { converCreatedAt } from "@/src/utils/conver-created-at";

interface FolderCardProps {
    folder: FolderResponse;
}

export default function FolderCard({ folder }: FolderCardProps) {
    // Couleur thématique pour les dossiers (Jaune/Ambre)
    // Vous pouvez changer ces valeurs selon votre charte graphique
    const folderColor = "#F59E0B"; // amber-500
    const folderBgColor = "#F59E0B20"; // amber-500 avec 20% d'opacité

    return (
        <div className="flex flex-col justify-center items-start cursor-pointer hover:opacity-80 transition-opacity">
            <div
                className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-3"
                style={{
                    backgroundColor: folderBgColor,
                    color: folderColor,
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-10 h-10"
                >
                    <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                </svg>
            </div>

            <h2
                className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate w-full flex items-start justify-start"
                title={folder.name}
            >
                {folder.name}
            </h2>

            <div
                className="w-full flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                <span>Dossier</span>

            </div>
        </div>
    );
}