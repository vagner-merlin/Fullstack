import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { NotificationsProvider } from './context/NotificationsContext';
import BoutiqueToastContainer from './components/notifications/Toast';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router>
              <AppRouter />
              <BoutiqueToastContainer />
            </Router>
          </FavoritesProvider>
        </CartProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export default App;

