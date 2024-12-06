const { z } = require("zod");

const createVacancyValidator = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  rent: z.number().positive("Rent must be a positive number"),
  deposit: z.number().positive("Deposit must be a positive number"),
  address: z.string().min(5, "Address must be at least 3 characters long"),
  postcode: z.string().min(4, "Postcode must be at least 4 characters long"),
  bedrooms: z.number().int().positive("Bedrooms must be a positive integer"),
  bathrooms: z.number().int().positive("Bathrooms must be a positive integer"),
  contact: z.string().regex(/^\+?[1-9]\d{1,14}$/,"Contact must be a valid international phone number (E.164 format)"),
  benefits: z.string().optional(),
  bills: z.boolean(),
  nationality: z.string().optional(),
  roomType: z.enum(
    ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"],
    "Invalid room type"
  ),
  preferredType: z
    .enum(["Student", "Boy", "Girl", "Professional", "Couple"])
    .optional(),
  parking: z.boolean().optional(),
  available: z
    .string()
    .transform((str) => new Date(str))
    .optional(), // Converts string to Date
});

module.exports = { createVacancyValidator };
