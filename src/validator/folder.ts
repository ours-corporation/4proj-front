import { z } from "zod";

export const createNewFolderValidator = z.object({
    name: z.string("Le nom du dossier est obligatoire")
        .min(1, "Le nom du dossier ne peut pas être vide")
        .max(255, "Le nom du dossier ne peut pas dépasser 255 caractères"),
});