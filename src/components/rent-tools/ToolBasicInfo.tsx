import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { RentingFormValues } from "./types";

interface ToolBasicInfoProps {
  form: UseFormReturn<RentingFormValues>;
}

export const ToolBasicInfo = ({ form }: ToolBasicInfoProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="toolName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tool Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter tool name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="tractor">Tractor</SelectItem>
                <SelectItem value="harvester">Harvester</SelectItem>
                <SelectItem value="plough">Plough</SelectItem>
                <SelectItem value="sprayer">Sprayer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};