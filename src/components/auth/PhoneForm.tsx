import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PhoneFormProps {
  phone: string;
  setPhone: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const PhoneForm = ({ phone, setPhone, isLoading, onSubmit }: PhoneFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number (e.g., 9876543210)"
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </form>
  );
};

export default PhoneForm;