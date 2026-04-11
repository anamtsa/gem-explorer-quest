import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import GemDetail from "./pages/GemDetail";
import AddGem from "./pages/AddGem";
import SavedLists from "./pages/SavedLists";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const onboarded = localStorage.getItem("hg_onboarded") === "1";

  return (
    <Routes key={onboarded ? "onboarded" : "fresh"}>
      <Route path="/welcome" element={onboarded ? <Navigate to="/" replace /> : <Onboarding />} />
      <Route path="/" element={onboarded ? <Home /> : <Navigate to="/welcome" replace />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/gem/:id" element={<GemDetail />} />
      <Route path="/add" element={<AddGem />} />
      <Route path="/saved" element={<SavedLists />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <BottomNav />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
