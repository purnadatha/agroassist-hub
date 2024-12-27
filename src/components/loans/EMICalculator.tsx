import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [emi, setEmi] = useState<number | null>(null);

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const R = parseFloat(interestRate) / 12 / 100;
    const N = parseFloat(loanTenure) * 12;

    if (P && R && N) {
      const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      setEmi(Math.round(emi));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>EMI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Loan Amount (₹)</label>
          <Input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter loan amount"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Interest Rate (%)</label>
          <Input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Enter interest rate"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Loan Tenure (Years)</label>
          <Input
            type="number"
            value={loanTenure}
            onChange={(e) => setLoanTenure(e.target.value)}
            placeholder="Enter loan tenure"
          />
        </div>
        <Button onClick={calculateEMI} className="w-full">Calculate EMI</Button>
        {emi && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg">
            <p className="text-center font-semibold">
              Monthly EMI: ₹{emi.toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EMICalculator;