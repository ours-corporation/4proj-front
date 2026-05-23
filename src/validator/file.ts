import { z } from "zod";

export const addFileValidator = z.object({
    files: z
        .array(z.instanceof(File, { message: "Chaque élément doit être un fichier" }))
        .min(1, "Au moins un fichier est requis")
        .max(50, "50 fichiers maximum par envoi"),
});

export const updateFileValidator = z.object({
    name: z.string("Le nom du fichier est obligatoire" )
        .min(1, "Le nom du fichier ne peut pas être vide")
        .max(255, "Le nom du fichier ne peut pas dépasser 255 caractères")
});