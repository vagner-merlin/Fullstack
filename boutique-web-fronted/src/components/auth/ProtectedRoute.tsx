import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles,
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-boutique-rose-light via-white to-boutique-beige">
        <div className="text-center">
          <div className="inline-block p-8 bg-white rounded-2xl shadow-card mb-4">
            <div className="w-16 h-16 border-4 border-boutique-rose border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="font-poppins text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si se especifican roles permitidos, verificar el rol del usuario
  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      // Redirigir a la página apropiada según el rol del usuario
      const roleRedirects: Record<UserRole, string> = {
        client: '/shop',
        seller: '/seller/home',
        admin: '/admin/dashboard',
        superadmin: '/admin/dashboard',
      };
      
      return <Navigate to={roleRedirects[user.role] || '/'} replace />;
    }
  }

  // Usuario autenticado y con rol permitido
  return <>{children}</>;
};

export default ProtectedRoute;
