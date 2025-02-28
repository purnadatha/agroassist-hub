
import { useState } from 'react';

export const useLoginState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return {
    isLoading,
    email,
    password,
    setIsLoading,
    setEmail,
    setPassword
  };
};
