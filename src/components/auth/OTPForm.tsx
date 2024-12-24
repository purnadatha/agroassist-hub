import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useEffect } from "react";

interface OTPFormProps {
  otp: string;
  setOTP: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onResend: () => void;
  onChangePhone: () => void;
  resendDisabled: boolean;
  resendTimer: number;
}

const OTPForm = ({
  otp,
  setOTP,
  isLoading,
  onSubmit,
  onResend,
  onChangePhone,
  resendDisabled,
  resendTimer,
}: OTPFormProps) => {
  const inputRefs = Array(6).fill(0).map(() => useRef<HTMLInputElement>(null));

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    
    const newOTP = otp.split('');
    newOTP[index] = value;
    setOTP(newOTP.join(''));

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Enter OTP</label>
        <div className="flex justify-center gap-2">
          {Array(6).fill(0).map((_, index) => (
            <Input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className="w-12 h-12 text-center text-lg"
              value={otp[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={onChangePhone}
          disabled={isLoading}
        >
          Change Phone Number
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onResend}
          disabled={isLoading || resendDisabled}
        >
          {resendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
        </Button>
      </div>
    </form>
  );
};

export default OTPForm;