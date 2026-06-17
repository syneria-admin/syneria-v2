import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute = ({ children, adminOnly = false }: any) => {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/" replace />;
  if (adminOnly && user?.role !== 'ADMIN') return <Navigate to="/profile" replace />;

  return children;
};
