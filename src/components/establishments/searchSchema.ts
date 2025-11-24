import z from "zod"

export const searchSchema = z.object({
  destination: z.string().optional().nullable(),
  checkIn: z.date().optional().nullable(),
  checkOut: z.date().optional().nullable(),
  guests: z.number().optional().nullable(),
})

export type SearchFormData = z.infer<typeof searchSchema>