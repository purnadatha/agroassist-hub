import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductDetails } from "./ProductDetails";
import { ImageUpload } from "./ImageUpload";
import { formSchema, type SellingFormValues } from "./types";
import { uploadFile } from "@/utils/fileUpload";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const SellingForm = () => {
  useRequireAuth(); // Add this line to enforce authentication
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      setSelectedFile(file);
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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          title: "Authentication required",
          description: "Please log in to list products.",
          variant: "destructive",
        });
        return;
      }

      let imageUrl = "";
      if (selectedFile) {
        imageUrl = await uploadFile(selectedFile);
      }

      const { error } = await supabase.from("products").insert({
        user_id: session.user.id,
        product_name: values.productName,
        category: values.category,
        quantity: values.quantity,
        unit: values.unit,
        price: values.price,
        description: values.description,
        location: values.location,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast({
        title: "Product listed successfully!",
        description: "Your product has been listed in the marketplace.",
      });
      
      form.reset();
      setImagePreview(null);
      setSelectedFile(null);
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