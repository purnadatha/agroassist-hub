import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tractor, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface Tool {
  id: string;
  user_id?: string;
  tool_name: string;
  category: string;
  rental_duration: string;
  price_per_day: string;
  description: string;
  location: string;
  image_url: string | null;
}

const fetchTools = async () => {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const RentingPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);
  
  const { data: tools = [], isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools,
  });

  const handleDelete = async (toolId: string) => {
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', toolId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tools'] });
      
      toast({
        title: "Tool deleted",
        description: "The tool has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast({
        title: "Error",
        description: "Failed to delete the tool. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading tools...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error loading tools. Please try again later.</div>;
  }

  if (tools.length === 0) {
    return <div className="text-center p-4">No tools available for rent.</div>;
  }

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

    window.location.href = `mailto:support@agrotrack.com?subject=${subject}&body=${body}`;

    toast({
      title: "Email Client Opened",
      description: "You can now send an email to the tool owner.",
    });
  };

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
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{tool.tool_name}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{tool.category}</p>
              </div>
              {tool.user_id === currentUserId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDelete(tool.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
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