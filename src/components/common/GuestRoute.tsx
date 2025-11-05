import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    // Redirect authenticated users to their dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'seller') {
      return <Navigate to="/seller" replace />;
    } else {
      return <Navigate to="/customer" replace />;
    }
  }

  return <>{children}</>;
}

