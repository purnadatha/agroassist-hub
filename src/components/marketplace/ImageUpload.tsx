import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SellingFormValues } from "./types";

interface ImageUploadProps {
  form: UseFormReturn<SellingFormValues>;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUpload = ({ form, imagePreview, onImageChange }: ImageUploadProps) => {
  return (
    <FormField
      control={form.control}
      name="imageUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Product Image</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="cursor-pointer"
            />
          </FormControl>
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};