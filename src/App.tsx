
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import RentTools from "./pages/RentTools";
import Loans from "./pages/Loans";
import CropRecommendation from "./pages/CropRecommendation";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="agrotrack-theme">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/">
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route index element={<Welcome />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="marketplace" element={
                  <ProtectedRoute>
                    <Marketplace />
                  </ProtectedRoute>
                } />
                <Route path="rent-tools" element={
                  <ProtectedRoute>
                    <RentTools />
                  </ProtectedRoute>
                } />
                <Route path="loans" element={
                  <ProtectedRoute>
                    <Loans />
                  </ProtectedRoute>
                } />
                <Route path="crop-recommendation" element={
                  <ProtectedRoute>
                    <CropRecommendation />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
