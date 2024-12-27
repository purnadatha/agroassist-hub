import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { bankSchemes } from "@/data/bankSchemes";
import { Trash2 } from "lucide-react";

interface LoanScheme {
  id: string;
  bankName: string;
  schemeName: string;
  interestRate: number;
  maxAmount: number;
  tenure: number;
  description: string;
  applicationDate?: string;  // Made optional with ?
  status?: string;          // Made optional with ?
}

const LoanSchemes = () => {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [schemes, setSchemes] = useState<LoanScheme[]>([]);
  const [appliedSchemes, setAppliedSchemes] = useState<LoanScheme[]>(() => {
    const saved = localStorage.getItem("appliedSchemes");
    return saved ? JSON.parse(saved) : [];
  });

  const handleBankChange = (value: string) => {
    setSelectedBank(value);
    setSchemes(bankSchemes[value] || []);
  };

  const applyForScheme = (scheme: LoanScheme) => {
    const appliedScheme = {
      ...scheme,
      applicationDate: new Date().toISOString(),
      status: "Pending"
    };
    const updatedSchemes = [...appliedSchemes, appliedScheme];
    setAppliedSchemes(updatedSchemes);
    localStorage.setItem("appliedSchemes", JSON.stringify(updatedSchemes));
    toast.success("Loan application submitted successfully!");
  };

  const deleteAppliedScheme = (schemeId: string) => {
    const updatedSchemes = appliedSchemes.filter(scheme => scheme.id !== schemeId);
    setAppliedSchemes(updatedSchemes);
    localStorage.setItem("appliedSchemes", JSON.stringify(updatedSchemes));
    toast.success("Application removed successfully!");
  };

  return (
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
            {Object.keys(bankSchemes).map((bank) => (
              <SelectItem key={bank} value={bank}>
                {bankSchemes[bank][0].bankName}
              </SelectItem>
            ))}
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

        {appliedSchemes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Applied Schemes</h3>
            <div className="space-y-4">
              {appliedSchemes.map((scheme) => (
                <Card key={scheme.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{scheme.bankName}</h4>
                        <p className="text-sm">{scheme.schemeName}</p>
                        <p className="text-sm text-muted-foreground">
                          Applied on: {new Date(scheme.applicationDate!).toLocaleDateString()}
                        </p>
                        <p className="text-sm">Status: {scheme.status}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteAppliedScheme(scheme.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoanSchemes;