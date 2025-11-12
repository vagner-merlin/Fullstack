import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Landing
import LandingPage from '../pages/Landing/LandingPage';

// Client Pages
import ShopPage from '../pages/client/ShopPage';
import ProductDetailPage from '../pages/client/ProductDetailPage';
import CartPage from '../pages/client/CartPage';
import CheckoutPage from '../pages/client/CheckoutPage';
import ConfirmationPage from '../pages/client/ConfirmationPage';
import OrdersPage from '../pages/client/OrdersPage';
import OrderDetailPage from '../pages/Orders/OrderDetailPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import FavoritesPage from '../pages/Favorites/FavoritesPage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import CompleteProfilePage from '../pages/auth/CompleteProfilePage';

// Admin Pages
import { AdminLayout } from '../components/admin/AdminLayout';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { ProductsPage } from '../pages/admin/ProductsPage';
import { VariantsPage } from '../pages/admin/VariantsPage';
import { ImagesPage } from '../pages/admin/ImagesPage';
import { CategoriesPage } from '../pages/admin/CategoriesPage';
import { OrdersPageAdmin } from '../pages/admin/OrdersPageAdmin';
import { ProvidersPage } from '../pages/admin/ProvidersPage';
import { EmployeesPage } from '../pages/admin/EmployeesPage';
import { ClientsPage } from '../pages/admin/ClientsPage';
import { ProfilePageAdmin } from '../pages/admin/ProfilePageAdmin';
import { AIAnalyticsPage } from '../pages/admin/AIAnalyticsPage';
import { InventoryPage } from '../pages/admin/InventoryPage';

// Seller Pages
import { SellerLayout } from '../components/seller/SellerLayout';
import { SellerHomePage } from '../pages/seller/SellerHomePage';
import { PosPage } from '../pages/seller/PosPage';
import { SellerDashboard } from '../pages/seller/SellerDashboard';

// Super Admin Pages - COMENTADO TEMPORALMENTE (sistema mock)
// import { SuperAdminLayout } from '../components/superadmin/SuperAdminLayout';
// import { UsersPage } from '../pages/superadmin/UsersPage';
// import { RolesPage } from '../pages/superadmin/RolesPage';
// import { SystemLogsPage } from '../pages/superadmin/SystemLogsPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />

      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/complete-profile" element={<CompleteProfilePage />} />

      {/* Placeholder routes - to be implemented */}
      <Route path="/contact" element={<Navigate to="/" replace />} />
      <Route path="/about" element={<Navigate to="/" replace />} />
      <Route path="/shipping" element={<Navigate to="/" replace />} />
      <Route path="/returns" element={<Navigate to="/" replace />} />
      <Route path="/faq" element={<Navigate to="/" replace />} />
      <Route path="/privacy" element={<Navigate to="/" replace />} />
      <Route path="/terms" element={<Navigate to="/" replace />} />

      {/* Admin Routes - Protected */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="ai-analytics" element={<AIAnalyticsPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="variants" element={<VariantsPage />} />
                <Route path="images" element={<ImagesPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="orders" element={<OrdersPageAdmin />} />
                <Route path="providers" element={<ProvidersPage />} />
                <Route path="employees" element={<EmployeesPage />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="profile" element={<ProfilePageAdmin />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Seller Routes - Protected */}
      <Route 
        path="/seller/*" 
        element={
          <ProtectedRoute allowedRoles={['seller', 'admin', 'superadmin']}>
            <SellerLayout>
              <Routes>
                <Route path="dashboard" element={<SellerDashboard />} />
                <Route path="home" element={<SellerHomePage />} />
                <Route path="pos" element={<PosPage />} />
                <Route path="*" element={<Navigate to="/seller/dashboard" replace />} />
              </Routes>
            </SellerLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Super Admin Routes - COMENTADO TEMPORALMENTE (sistema mock)
      <Route 
        path="/superadmin/*" 
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <SuperAdminLayout>
              <Routes>
                <Route path="users" element={<UsersPage />} />
                <Route path="roles" element={<RolesPage />} />
                <Route path="logs" element={<SystemLogsPage />} />
                <Route path="*" element={<Navigate to="/superadmin/users" replace />} />
              </Routes>
            </SuperAdminLayout>
          </ProtectedRoute>
        } 
      />
      */}

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
