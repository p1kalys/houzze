const { z } = require("zod");

const createVacancyValidator = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long"),
  rent: z.number().int().min(0,"Rent must be a positive number"),
  deposit: z.number().int().min(0,"Deposit must be a positive number"),
  address: z.string().min(5, "Address must be at least 3 characters long"),
  postcode: z.string().min(4, "Postcode must be at least 4 characters long"),
  bedrooms: z.number().int().min(0, "Bedrooms must be a positive integer"),
  bathrooms: z.number().int().min(0, "Bathrooms must be a positive integer"),
  contact: z.string().regex(/^\+?[0-9]\d{1,14}$/,"Contact must be a valid international phone number (E.164 format)"),
  benefits: z.string().optional(),
  bills: z.boolean(),
  email: z.string().email("Invalid email format").optional(),
  name: z.string(),
  nationality: z.string().optional(),
  roomType: z.enum(["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"],
    "Invalid room type"
  ),
  preferredType: z
    .array(
      z.enum(["Student", "Male", "Female", "Professional", "Couple", "Any"], "Invalid preferred type")
    )
    .optional(),
  parking: z.boolean().optional(),
  available: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
});

module.exports = { createVacancyValidator };
