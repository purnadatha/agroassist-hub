import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductDetails } from "./ProductDetails";
import { ImageUpload } from "./ImageUpload";
import { formSchema, type SellingFormValues } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const SellingForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SellingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      category: "",
      quantity: "",
      unit: "",
      price: "",
      description: "",
      location: "",
      imageUrl: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (values: SellingFormValues) => {
    try {
      setIsSubmitting(true);

      // First, check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to list products.",
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

      // Insert product into database with user_id
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          product_name: values.productName,
          category: values.category,
          quantity: values.quantity,
          unit: values.unit,
          price: values.price,
          description: values.description,
          location: values.location,
          image_url: imageUrl,
          user_id: session.user.id, // Set the user_id from the session
        });

      if (insertError) throw insertError;

      // Invalidate products query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['products'] });

      toast({
        title: "Product listed successfully!",
        description: "Your product has been listed in the marketplace.",
      });
      
      form.reset();
      setImagePreview(null);
    } catch (error) {
      console.error('Error listing product:', error);
      toast({
        title: "Error listing product",
        description: "There was an error listing your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ProductBasicInfo form={form} />
        <ProductDetails form={form} />
        <ImageUpload 
          form={form}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Listing Product..." : "List Product"}
        </Button>
      </form>
    </Form>
  );
};

export default SellingForm;