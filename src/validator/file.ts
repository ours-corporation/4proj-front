import { z } from "zod";

export const addFileValidator = z.object({
    file: z.instanceof(File, { message: "Un fichier est requis" }),
});

export const updateFileValidator = z.object({
    name: z.string("Le nom du fichier est obligatoire" )
        .min(1, "Le nom du fichier ne peut pas être vide")
        .max(255, "Le nom du fichier ne peut pas dépasser 255 caractères")
});