import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { ToolBasicInfo } from "./ToolBasicInfo";
import { ToolDetails } from "./ToolDetails";
import { rentingFormSchema, type RentingFormValues } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const RentingForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RentingFormValues>({
    resolver: zodResolver(rentingFormSchema),
    defaultValues: {
      toolName: "",
      category: "",
      rentalDuration: "",
      pricePerDay: "",
      description: "",
      location: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: RentingFormValues) => {
    try {
      setIsSubmitting(true);

      // First, check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to list tools.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Upload image to Supabase Storage if we have one
      let imageUrl = null;
      if (imagePreview) {
        const file = await fetch(imagePreview).then((res) => res.blob());
        const fileExt = file.type.split('/')[1];
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file, {
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Insert tool into database
      const { error: insertError } = await supabase
        .from('tools')
        .insert({
          tool_name: values.toolName,
          category: values.category,
          rental_duration: values.rentalDuration,
          price_per_day: values.pricePerDay,
          description: values.description,
          location: values.location,
          image_url: imageUrl,
          user_id: session.user.id,
        });

      if (insertError) throw insertError;

      // Invalidate tools query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['tools'] });

      toast({
        title: "Tool listed successfully!",
        description: "Your tool has been listed for rent.",
      });
      
      form.reset();
      setImagePreview(null);
    } catch (error) {
      console.error('Error listing tool:', error);
      toast({
        title: "Error listing tool",
        description: "There was an error listing your tool. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ToolBasicInfo form={form} />
        <ToolDetails form={form} />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Tool Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="cursor-pointer"
          />
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-md" 
              />
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Listing Tool..." : "List Tool"}
        </Button>
      </form>
    </Form>
  );
};

export default RentingForm;