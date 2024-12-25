import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface RegistrationFormProps {
  isLoading: boolean;
  onSubmit: (formData: {
    fullName: string;
    email: string;
    aadhar: string;
    pan: string;
  }) => void;
}

const RegistrationForm = ({ isLoading, onSubmit }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    aadhar: '',
    pan: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <Input 
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          placeholder="Enter your full name"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input 
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Enter your email"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Aadhar Number</label>
        <Input 
          type="text"
          value={formData.aadhar}
          onChange={(e) => setFormData({...formData, aadhar: e.target.value})}
          placeholder="Enter your 12-digit Aadhar number"
          required
          disabled={isLoading}
          minLength={12}
          maxLength={12}
          pattern="\d{12}"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">PAN Number</label>
        <Input 
          type="text"
          value={formData.pan}
          onChange={(e) => setFormData({...formData, pan: e.target.value})}
          placeholder="Enter your 10-character PAN number"
          required
          disabled={isLoading}
          minLength={10}
          maxLength={10}
          pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};

export default RegistrationForm;