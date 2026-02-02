import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";

// Layouts
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import {ProtectedRoute} from "@/components/auth/ProtectedRoute";

// Auth Pages
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";

// App Pages
import Dashboard from "@/pages/Dashboard";
import Subjects from "@/pages/Subjects";
import AddSubject from "@/pages/AddSubject";
import SubjectDetail from "@/pages/SubjectDetail";
import SmartSchedule from "@/pages/SmartSchedule";
import Rewards from "@/pages/Rewards";
import Reports from "@/pages/Reports";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
              </Route>

              {/* App Routes */}
              <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/subjects/add" element={<AddSubject />} />
                <Route path="/subjects/:id" element={<SubjectDetail />} />
                <Route path="/schedule" element={<SmartSchedule />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              </Route>

              {/* Redirects & Fallback */}
              <Route path="/" element={<Navigate to="/signin" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
