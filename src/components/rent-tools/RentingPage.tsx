import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tractor } from "lucide-react";

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

interface RentingPageProps {
  tools: Tool[];
}

const RentingPage = ({ tools }: RentingPageProps) => {
  const { toast } = useToast();

  const handleRent = (tool: Tool) => {
    const subject = encodeURIComponent(`Interest in renting ${tool.toolName}`);
    const body = encodeURIComponent(
      `Hello,\n\nI am interested in renting the following tool:\n\n` +
      `Tool: ${tool.toolName}\n` +
      `Category: ${tool.category}\n` +
      `Rental Duration: ${tool.rentalDuration} days\n` +
      `Price: ₹${tool.pricePerDay}/day\n` +
      `Location: ${tool.location}\n\n` +
      `Please contact me with more details.\n\nThank you!`
    );

    // Open default email client
    window.location.href = `mailto:support@agrotrack.com?subject=${subject}&body=${body}`;

    toast({
      title: "Email Client Opened",
      description: "You can now send an email to the tool owner.",
    });
  };

  if (tools.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No tools available for rent at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <Card key={tool.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            {tool.imageUrl && (
              <div className="w-full h-48 mb-4">
                <img
                  src={tool.imageUrl}
                  alt={tool.toolName}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
            <CardTitle className="text-lg">{tool.toolName}</CardTitle>
            <p className="text-sm text-muted-foreground capitalize">{tool.category}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Duration:</span> {tool.rentalDuration} days
              </p>
              <p className="text-sm">
                <span className="font-medium">Price:</span> ₹{tool.pricePerDay}/day
              </p>
              <p className="text-sm">
                <span className="font-medium">Location:</span> {tool.location}
              </p>
              <p className="text-sm line-clamp-2">
                <span className="font-medium">Description:</span> {tool.description}
              </p>
              <Button
                className="w-full mt-4"
                onClick={() => handleRent(tool)}
              >
                <Tractor className="mr-2 h-4 w-4" />
                Rent Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RentingPage;