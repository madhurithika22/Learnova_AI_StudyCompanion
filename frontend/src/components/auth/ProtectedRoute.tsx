import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useUser();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;