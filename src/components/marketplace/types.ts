import { z } from "zod";

export const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string().min(1, "Please select a unit"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  imageUrl: z.string().optional(),
});

export type SellingFormValues = z.infer<typeof formSchema>;