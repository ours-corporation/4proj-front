import { z } from "zod";

export const createPublicShareLinkValidator = z.object({
    password: z.string()
        .min(4, "Le mot de passe doit faire au moins 4 caractères")
        .optional(),
    expiresAt: z.string("La date d'expiration est requise")
        .datetime({message: "Format de date invalide (ISO 8601 requis)"})
        .refine(dateStr => {
            const date = new Date(dateStr);
            return date > new Date();
        },{message: "La date d'expiration doit être dans le futur"})
});