import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Instagram, Facebook, Play, LogOut, UserCircle, Heart, Bell } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';
import { useNotifications } from '../../hooks/useNotifications';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { favorites } = useFavorites();
  const { unreadCount } = useNotifications();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navLinks = [
    { name: 'INICIO', path: '/' },
    { name: 'GALERÍA', path: '/shop' },
    { name: 'PEDIDOS', path: '/orders' },
    { name: 'CONTACTO', path: '/contact' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 4L4 10L16 16L28 10L16 4Z"
                  fill="#E5C5B5"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                />
                <path
                  d="M4 16L16 22L28 16"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M4 22L16 28L28 22"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="font-raleway text-xl font-semibold text-boutique-black-matte tracking-wide">
              THEBUTIK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-poppins font-medium text-gray-700 hover:text-boutique-black-matte transition-colors tracking-wide"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            {/* Auth Section - Desktop only */}
            {isAuthenticated && user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-boutique-beige rounded-full hover:bg-boutique-rose-light transition-colors"
                >
                  <UserCircle size={18} className="text-boutique-black-matte" />
                  <span className="font-poppins text-sm font-medium text-boutique-black-matte">
                    {user.first_name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 rounded-full font-poppins font-medium hover:bg-red-500 hover:text-white transition-all"
                >
                  <LogOut size={18} />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/auth/login" 
                className="hidden md:block px-6 py-2 border-2 border-boutique-black-matte text-boutique-black-matte rounded-full font-poppins font-medium hover:bg-boutique-black-matte hover:text-white transition-all"
              >
                Iniciar Sesión
              </Link>
            )}

            {/* Social Icons - Desktop only */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <Play size={18} fill="currentColor" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>

            {/* Favorites Icon */}
            <Link to="/favorites" className="relative hidden md:block">
              <Heart className="w-6 h-6 text-gray-700 hover:text-boutique-rose transition-colors" strokeWidth={1.5} />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-boutique-rose text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Notifications Icon */}
            <Link to="/notifications" className="relative hidden md:block">
              <Bell className="w-6 h-6 text-gray-700 hover:text-boutique-rose transition-colors" strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-boutique-black-matte transition-colors" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-8 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm font-poppins font-medium text-gray-700 hover:text-boutique-black-matte transition-colors py-2"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Auth Section Mobile */}
            {isAuthenticated && user ? (
              <div className="space-y-3 pt-2">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-boutique-beige rounded-lg hover:bg-boutique-rose-light transition-colors"
                >
                  <UserCircle size={20} className="text-boutique-black-matte" />
                  <div>
                    <p className="font-poppins text-sm font-semibold text-boutique-black-matte">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="font-poppins text-xs text-gray-600">
                      Ver mi perfil
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-red-500 text-white rounded-full font-poppins font-medium hover:bg-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full px-6 py-3 bg-boutique-black-matte text-white text-center rounded-full font-poppins font-medium"
              >
                Iniciar Sesión
              </Link>
            )}
            
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <Play size={18} fill="currentColor" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
