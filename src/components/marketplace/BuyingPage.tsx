import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Trash2, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "./types";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

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
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { addToCart } = useCart();
  
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete the product. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    const subject = encodeURIComponent(`Interest in purchasing ${product.product_name}`);
    const body = encodeURIComponent(
      `Hello,\n\nI am interested in purchasing the following product:\n\n` +
      `Product: ${product.product_name}\n` +
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

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.product_name,
      price: product.price,
      image: product.image_url,
      quantity: 1,
      type: 'product'
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
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{product.product_name}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
              </div>
              {product.user_id === currentUserId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
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
              <div className="flex gap-2 mt-4">
                <Button
                  className="flex-1"
                  onClick={() => handleBuy(product)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => handleAddToCart(product)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BuyingPage;
