import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tractor } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Tool {
  id: string;
  tool_name: string;
  category: string;
  rental_duration: string;
  price_per_day: string;
  description: string;
  location: string;
  image_url: string;
}

const RentingPage = () => {
  const { toast } = useToast();

  const { data: tools = [], isLoading, error } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Tool[];
    },
  });

  const handleRent = (tool: Tool) => {
    const subject = encodeURIComponent(`Interest in renting ${tool.tool_name}`);
    const body = encodeURIComponent(
      `Hello,\n\nI am interested in renting the following tool:\n\n` +
      `Tool: ${tool.tool_name}\n` +
      `Category: ${tool.category}\n` +
      `Rental Duration: ${tool.rental_duration} days\n` +
      `Price: ₹${tool.price_per_day}/day\n` +
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

  if (isLoading) {
    return <div>Loading tools...</div>;
  }

  if (error) {
    return <div>Error loading tools: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <Card key={tool.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            {tool.image_url && (
              <div className="w-full h-48 mb-4">
                <img
                  src={tool.image_url}
                  alt={tool.tool_name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
            <CardTitle className="text-lg">{tool.tool_name}</CardTitle>
            <p className="text-sm text-muted-foreground capitalize">{tool.category}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Duration:</span> {tool.rental_duration} days
              </p>
              <p className="text-sm">
                <span className="font-medium">Price:</span> ₹{tool.price_per_day}/day
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
