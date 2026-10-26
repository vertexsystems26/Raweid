import { z } from "zod";

export const TUNISIAN_GOVERNORATES = [
  "Siliana",
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Béja",
  "Bizerte",
  "Jendouba",
  "Le Kef",
  "Zaghouan",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gafsa",
  "Tozeur",
  "Kebili",
  "Gabès",
  "Médenine",
  "Tataouine",
] as const;

export const candidateSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Le nom et prénom doivent contenir au moins 3 caractères" }),
  phone: z
    .string()
    .regex(/^[0-9+ ]{8,15}$/, { message: "Numéro de téléphone valide requis (ex: 98 123 456)" }),
  email: z
    .string()
    .email({ message: "Adresse email invalide" })
    .optional()
    .or(z.literal("")),
  governorate: z.enum(TUNISIAN_GOVERNORATES, {
    message: "Veuillez sélectionner un gouvernorat",
  }),
  serviceRequested: z.enum(
    [
      "TRAINING",
      "AGRI_CONSULTING",
      "INVESTOR_SUPPORT",
      "FEED_MANUFACTURING",
    ] as const,
    { message: "Veuillez sélectionner un service" }
  ),
  courseId: z.string().optional(),
  projectDetails: z
    .string()
    .max(1000, { message: "La description ne doit pas dépasser 1000 caractères" })
    .optional(),
});

export type CandidateInput = z.infer<typeof candidateSchema>;
