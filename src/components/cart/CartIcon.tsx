
import React, { useState } from 'react';
import { ShoppingCart, X, Trash2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { Separator } from '@/components/ui/separator';

export const CartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeFromCart, clearCart, getItemCount, getTotalPrice } = useCart();
  
  const toggleCart = () => setIsOpen(!isOpen);

  const handleBuyNow = () => {
    window.location.href = "https://mail.google.com";
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative" 
        onClick={toggleCart}
      >
        <ShoppingCart className="h-5 w-5" />
        {getItemCount() > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center rounded-full"
          >
            {getItemCount()}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 shadow-lg z-50">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-lg">Your Cart</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleCart}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="max-h-96 overflow-auto">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.type}`} className="flex items-center gap-2">
                    {item.image && (
                      <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <p className="text-sm font-medium">{item.name}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          ₹{item.price} {item.type === 'tool' ? '/day' : ''} × {item.quantity}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          
          {items.length > 0 && (
            <>
              <Separator />
              <CardFooter className="flex justify-between py-4">
                <div>
                  <p className="font-medium">Total:</p>
                  <p className="text-muted-foreground">₹{getTotalPrice().toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearCart}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Cart
                  </Button>
                  <Button variant="default" size="sm" onClick={handleBuyNow}>
                    <Mail className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  );
};
