import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { AccountLayout } from "./account/AccountLayout";

export const Account = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AccountLayout />;
}