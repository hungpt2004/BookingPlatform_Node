import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useEffect } from "react";
import axiosInstance from "../../utils/AxiosInstance"; // Adjust path as needed

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, logout } = useAuthStore();

  // Effect to verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) return;

      // Optional: Verify token with your backend
      try {
        // Add an Authorization header to future requests
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        // You can also add a token verification API call here if needed
        // const response = await axiosInstance.get(`${BASE_URL}/user/verify-token`);
        // if (!response.data.valid) logout();
      } catch (error) {
        console.error("Token verification failed", error);
        logout();
      }
    };

    verifyToken();
  }, [logout]);

  // If not authenticated at all, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // If authenticated but wrong role, redirect based on role
  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "OWNER":
        return <Navigate to="/dashboard" replace />;
      case "ADMIN":
        return <Navigate to="/admin-dashboard" replace />;
      case "CUSTOMER":
        return <Navigate to="/home" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  // If authenticated and correct role, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
