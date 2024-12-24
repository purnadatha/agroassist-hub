import { useState } from 'react';

export const useLoginState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const startResendTimer = () => {
    setResendDisabled(true);
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return {
    isLoading,
    showOTP,
    phone,
    otp,
    resendDisabled,
    resendTimer,
    setIsLoading,
    setShowOTP,
    setPhone,
    setOTP,
    setResendDisabled,
    setResendTimer,
    startResendTimer
  };
};