import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface LoanScheme {
  id: string;
  bankName: string;
  schemeName: string;
  interestRate: number;
  maxAmount: number;
  tenure: number;
  description: string;
}

const bankSchemes: Record<string, LoanScheme[]> = {
  "SBI": [
    {
      id: "sbi1",
      bankName: "SBI",
      schemeName: "Kisan Credit Card",
      interestRate: 7,
      maxAmount: 1000000,
      tenure: 60,
      description: "Special credit facility for farmers with flexible repayment options"
    },
    {
      id: "sbi2",
      bankName: "SBI",
      schemeName: "Agri Gold Loan",
      interestRate: 8.5,
      maxAmount: 500000,
      tenure: 36,
      description: "Quick loan against agricultural gold with minimal documentation"
    }
  ],
  "HDFC": [
    {
      id: "hdfc1",
      bankName: "HDFC",
      schemeName: "Agri Equipment Finance",
      interestRate: 8,
      maxAmount: 750000,
      tenure: 48,
      description: "Finance for purchasing agricultural equipment and machinery"
    },
    {
      id: "hdfc2",
      bankName: "HDFC",
      schemeName: "Kisan Gold Card",
      interestRate: 7.5,
      maxAmount: 1200000,
      tenure: 60,
      description: "Comprehensive credit solution for agricultural needs"
    }
  ],
  "ICICI": [
    {
      id: "icici1",
      bankName: "ICICI",
      schemeName: "Kisan Flexi Cash",
      interestRate: 7.8,
      maxAmount: 800000,
      tenure: 48,
      description: "Flexible credit line for agricultural operations"
    },
    {
      id: "icici2",
      bankName: "ICICI",
      schemeName: "Tractor Loan",
      interestRate: 8.2,
      maxAmount: 1500000,
      tenure: 72,
      description: "Special financing for tractor purchase"
    }
  ],
  "PNB": [
    {
      id: "pnb1",
      bankName: "PNB",
      schemeName: "Krishi Udyami Scheme",
      interestRate: 7.4,
      maxAmount: 900000,
      tenure: 60,
      description: "Comprehensive loan for agricultural entrepreneurs"
    }
  ],
  "Axis": [
    {
      id: "axis1",
      bankName: "Axis",
      schemeName: "Farm Power",
      interestRate: 8.1,
      maxAmount: 1000000,
      tenure: 54,
      description: "Financing for farm mechanization"
    }
  ],
  "BOB": [
    {
      id: "bob1",
      bankName: "Bank of Baroda",
      schemeName: "Baroda Kisan Credit Card",
      interestRate: 7.6,
      maxAmount: 850000,
      tenure: 48,
      description: "Comprehensive credit card facility for farmers"
    }
  ],
  "Union": [
    {
      id: "union1",
      bankName: "Union Bank",
      schemeName: "Union Green Card",
      interestRate: 7.9,
      maxAmount: 700000,
      tenure: 36,
      description: "Green initiative financing for sustainable farming"
    }
  ],
  "Canara": [
    {
      id: "canara1",
      bankName: "Canara Bank",
      schemeName: "Crop Loan Plus",
      interestRate: 7.3,
      maxAmount: 600000,
      tenure: 24,
      description: "Short-term crop loan with additional benefits"
    }
  ],
  "Indian": [
    {
      id: "indian1",
      bankName: "Indian Bank",
      schemeName: "Kisan Tatkal",
      interestRate: 7.7,
      maxAmount: 550000,
      tenure: 36,
      description: "Quick approval farm loan scheme"
    }
  ],
  "BOI": [
    {
      id: "boi1",
      bankName: "Bank of India",
      schemeName: "Star Kisan Loan",
      interestRate: 7.5,
      maxAmount: 950000,
      tenure: 60,
      description: "Premium agricultural financing solution"
    }
  ],
  "KVB": [
    {
      id: "kvb1",
      bankName: "Karur Vysya Bank",
      schemeName: "KVB Kisan Suvidha",
      interestRate: 8.0,
      maxAmount: 500000,
      tenure: 36,
      description: "Convenient loan scheme for small farmers"
    }
  ],
  "Federal": [
    {
      id: "fed1",
      bankName: "Federal Bank",
      schemeName: "Agri Federal Plus",
      interestRate: 8.2,
      maxAmount: 600000,
      tenure: 48,
      description: "Comprehensive agricultural financing package"
    }
  ]
};

const Loans = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [emi, setEmi] = useState<number | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [schemes, setSchemes] = useState<LoanScheme[]>([]);

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const R = parseFloat(interestRate) / 12 / 100;
    const N = parseFloat(loanTenure) * 12;

    if (P && R && N) {
      const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      setEmi(Math.round(emi));
    }
  };

  const handleBankChange = (value: string) => {
    setSelectedBank(value);
    setSchemes(bankSchemes[value] || []);
  };

  const applyForScheme = (scheme: LoanScheme) => {
    // In a real app, this would make an API call to save the application
    toast.success("Loan application submitted successfully!");
    // You could dispatch this to a global state management solution
    const appliedScheme = {
      ...scheme,
      applicationDate: new Date().toISOString(),
      status: "Pending"
    };
    const existingSchemes = JSON.parse(localStorage.getItem("appliedSchemes") || "[]");
    localStorage.setItem("appliedSchemes", JSON.stringify([...existingSchemes, appliedScheme]));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1">
        <div className="p-4 border-b md:hidden">
          <MobileNav />
        </div>
        <main className="p-4">
          <h1 className="text-2xl font-bold text-primary mb-6">Loan Calculator & Schemes</h1>
          
          <div className="grid gap-6 md:grid-cols-2">
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

            <Card>
              <CardHeader>
                <CardTitle>Available Loan Schemes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={handleBankChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SBI">State Bank of India</SelectItem>
                    <SelectItem value="HDFC">HDFC Bank</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-4">
                  {schemes.map((scheme) => (
                    <Card key={scheme.id}>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold text-lg mb-2">{scheme.schemeName}</h3>
                        <div className="space-y-2 text-sm">
                          <p>Interest Rate: {scheme.interestRate}%</p>
                          <p>Maximum Amount: ₹{scheme.maxAmount.toLocaleString()}</p>
                          <p>Tenure: Up to {scheme.tenure} months</p>
                          <p className="text-muted-foreground">{scheme.description}</p>
                        </div>
                        <Button 
                          onClick={() => applyForScheme(scheme)}
                          className="w-full mt-4"
                        >
                          Apply Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Loans;