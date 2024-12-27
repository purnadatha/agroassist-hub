import { z } from "zod";

export const rentingFormSchema = z.object({
  toolName: z.string().min(2, "Tool name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  rentalDuration: z.string().min(1, "Rental duration is required"),
  pricePerDay: z.string().min(1, "Price per day is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
});

export type RentingFormValues = z.infer<typeof rentingFormSchema>;