import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  summary: z.string().min(10, "El resumen debe tener al menos 10 caracteres").max(200, "El resumen no puede exceder 200 caracteres"),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  category: z.enum(["tech", "business", "art", "social"], {
    message: "Selecciona una categoría válida",
  }),
  location: z.string().min(2, "Ingresa una ubicación o país"),
  tags: z.string().optional(), // Comma separated tags
  status: z.enum(["idea", "building", "running", "done"]).default("idea"),
  coverImageUrl: z.string().url("Debe ser una URL de imagen válida").optional().or(z.literal("")),
  goalAmount: z.string().optional().refine((val) => !val || !isNaN(Number(val)), {
    message: "La meta debe ser un número válido",
  }),
});

export const supportSchema = z.object({
  type: z.enum(["COLLABORATE", "MENTOR", "RESOURCE", "DONATE"], {
    message: "Selecciona el tipo de apoyo",
  }),
  message: z.string().min(5, "El mensaje debe tener al menos 5 caracteres"),
  amount: z.string().optional().refine((val) => !val || !isNaN(Number(val)), {
    message: "El monto debe ser un número válido",
  }),
  anonymous: z.boolean().default(false),
});

export const projectUpdateSchema = z.object({
  title: z.string().min(3, "El título de la actualización debe tener al menos 3 caracteres"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
  links: z.string().optional(), // Multiline or comma separated links
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type SupportInput = z.infer<typeof supportSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
