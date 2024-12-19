import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import SellingForm from "@/components/marketplace/SellingForm";
import BuyingPage from "@/components/marketplace/BuyingPage";

const Marketplace = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BackButton />
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
        </div>
        <Tabs defaultValue="buy" className="space-y-4">
          <TabsList>
            <TabsTrigger value="buy">Buy Products</TabsTrigger>
            <TabsTrigger value="sell">Sell Products</TabsTrigger>
          </TabsList>
          <TabsContent value="buy" className="space-y-4">
            <Card className="p-6">
              <BuyingPage />
            </Card>
          </TabsContent>
          <TabsContent value="sell" className="space-y-4">
            <Card className="p-6">
              <SellingForm />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Marketplace;