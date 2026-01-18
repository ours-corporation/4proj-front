import {z} from "zod";

export const loginValidatorValidator = z.object({
    email: z.email("Le format de l'email est invalide"),
    password: z.string({ message: "Le mot de passe est obligatoire" }).min(1, "Le mot de passe est obligatoire")
});

export const registerValidatorValidator = z.object({
    username: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 3, {
            message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
        })
        .refine((val) => !val || val.length <= 30, {
            message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères",
        })
        .refine(
            (val) => !val || /^[a-zA-Z0-9_-]+$/.test(val),
            { message: "Le nom d'utilisateur ne peut contenir que des lettres, des chiffres, des underscores (_) et des tirets (-)" }
        ),

    email: z.email("Le format de l'email est invalide"),
    password: z.string({ message: "Le mot de passe est obligatoire" }).min(1, "Le mot de passe est obligatoire"),
    confirmPassword: z.string({ message: "La confirmation du mot de passe est obligatoire" }).min(1, "La confirmation du mot de passe est obligatoire")
})