import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import EMICalculator from "@/components/loans/EMICalculator";
import LoanSchemes from "@/components/loans/LoanSchemes";
import { BackButton } from "@/components/ui/back-button";

const Loans = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1">
        <div className="p-4 border-b md:hidden">
          <MobileNav />
        </div>
        <main className="p-4">
          <BackButton />
          <h1 className="text-2xl font-bold text-primary mb-6">Loan Calculator & Schemes</h1>
          
          <div className="grid gap-6 md:grid-cols-2">
            <EMICalculator />
            <LoanSchemes />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Loans;