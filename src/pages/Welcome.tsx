import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-primary sm:text-5xl">
            Welcome to AgroTrack
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Your complete agricultural management solution. Track weather, trade products, and get AI assistance for better farming.
          </p>
          <div className="space-x-4">
            <Button
              onClick={() => navigate("/login")}
              className="bg-primary hover:bg-primary/90"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;