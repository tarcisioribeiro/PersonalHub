import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePermission?: {
    appName: string;
    action: string;
  };
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requirePermission,
}) => {
  const { isAuthenticated, isInitializing, hasPermission } = useAuthStore();

  // Mostra loading enquanto verifica autenticação
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Só redireciona após verificação completa
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requirePermission) {
    const { appName, action } = requirePermission;
    if (!hasPermission(appName, action)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
