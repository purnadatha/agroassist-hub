import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: string;
  productName: string;
  category: string;
  quantity: string;
  unit: string;
  price: string;
  description: string;
  location: string;
  imageUrl: string;
}

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const BuyingPage = () => {
  const { toast } = useToast();
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return <div className="text-center p-4">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error loading products. Please try again later.</div>;
  }

  if (products.length === 0) {
    return <div className="text-center p-4">No products available.</div>;
  }

  const handleBuy = (product: Product) => {
    const subject = encodeURIComponent(`Interest in purchasing ${product.productName}`);
    const body = encodeURIComponent(
      `Hello,\n\nI am interested in purchasing the following product:\n\n` +
      `Product: ${product.productName}\n` +
      `Category: ${product.category}\n` +
      `Quantity: ${product.quantity} ${product.unit}\n` +
      `Price: ₹${product.price}/${product.unit}\n` +
      `Location: ${product.location}\n\n` +
      `Please contact me with more details.\n\nThank you!`
    );

    window.location.href = `mailto:support@agrotrack.com?subject=${subject}&body=${body}`;

    toast({
      title: "Email Client Opened",
      description: "You can now send an email to the seller about this product.",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            {product.image_url && (
              <div className="w-full h-48 mb-4">
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
            <CardTitle className="text-lg">{product.product_name}</CardTitle>
            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Quantity:</span> {product.quantity} {product.unit}
              </p>
              <p className="text-sm">
                <span className="font-medium">Price:</span> ₹{product.price}/{product.unit}
              </p>
              <p className="text-sm">
                <span className="font-medium">Location:</span> {product.location}
              </p>
              <p className="text-sm line-clamp-2">
                <span className="font-medium">Description:</span> {product.description}
              </p>
              <Button
                className="w-full mt-4"
                onClick={() => handleBuy(product)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BuyingPage;