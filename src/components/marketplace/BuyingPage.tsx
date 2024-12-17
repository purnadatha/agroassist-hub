import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  productName: string;
  category: string;
  quantity: string;
  unit: string;
  price: string;
  description: string;
  location: string;
  imageUrl: string;
}

interface BuyingPageProps {
  products: Product[];
}

const BuyingPage = ({ products }: BuyingPageProps) => {
  const { toast } = useToast();

  const handleBuy = (product: Product) => {
    // Create mailto link with product details
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

    window.location.href = `mailto:?subject=${subject}&body=${body}`;

    toast({
      title: "Email Client Opened",
      description: "You can now send an email to the seller about this product.",
    });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            {product.imageUrl && (
              <div className="w-full h-48 mb-4">
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
            <CardTitle className="text-lg">{product.productName}</CardTitle>
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