import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { RentingFormValues } from "./types";

interface ToolDetailsProps {
  form: UseFormReturn<RentingFormValues>;
}

export const ToolDetails = ({ form }: ToolDetailsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="rentalDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rental Duration (days)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter rental duration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricePerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Day (₹)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter price per day" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter tool description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Enter your location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};