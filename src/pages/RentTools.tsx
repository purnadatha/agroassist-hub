import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import RentingForm from "@/components/rent-tools/RentingForm";
import RentingPage from "@/components/rent-tools/RentingPage";

interface Tool {
  id: number;
  toolName: string;
  category: string;
  rentalDuration: string;
  pricePerDay: string;
  description: string;
  location: string;
  imageUrl: string;
}

const RentTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);

  const handleToolSubmit = (tool: Omit<Tool, 'id'>) => {
    setTools([...tools, { ...tool, id: Date.now() }]);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BackButton />
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Rent Tools</h2>
        </div>
        <Tabs defaultValue="rent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rent">Rent Tools</TabsTrigger>
            <TabsTrigger value="list">List Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="rent" className="space-y-4">
            <Card className="p-6">
              <RentingPage tools={tools} />
            </Card>
          </TabsContent>
          <TabsContent value="list" className="space-y-4">
            <Card className="p-6">
              <RentingForm onSubmit={handleToolSubmit} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RentTools;