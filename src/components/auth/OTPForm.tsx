import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPFormProps {
  otp: string;
  setOTP: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
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
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Enter OTP</label>
        <div className="flex justify-center">
          <InputOTP
            value={otp}
            onChange={setOTP}
            maxLength={6}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, idx) => (
                  <InputOTPSlot key={idx} {...slot} index={idx} />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
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