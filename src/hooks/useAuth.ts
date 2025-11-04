import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "@/store";
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  fetchCurrentUser,
} from "@/store/slices/authSlice";
import { LoginCredentials, RegisterData } from "@/types/models.types";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token, isLoading, isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(loginAction(credentials)).unwrap();
      
      // Redirect based on role
      if (result.user.role === "admin") {
        navigate("/admin");
      } else if (result.user.role === "seller") {
        navigate("/seller");
      } else {
        navigate("/customer");
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const result = await dispatch(registerAction(data)).unwrap();
      navigate("/customer");
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await dispatch(logoutAction());
    navigate("/");
  };

  const getCurrentUser = async () => {
    try {
      await dispatch(fetchCurrentUser()).unwrap();
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  const fetchUser = async () => {
    return await getCurrentUser();
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    getCurrentUser,
    fetchUser,
  };
};


