import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-boutique-black-matte text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-raleway text-lg font-bold mb-4">THEBUTIK</h3>
            <p className="text-gray-400 text-sm font-poppins leading-relaxed">
              Tu destino de moda elegante. Descubre las últimas tendencias y
              colecciones exclusivas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop"
                  className="text-gray-400 hover:text-boutique-rose-pastel transition-colors text-sm"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-400 hover:text-boutique-rose-pastel transition-colors text-sm"
                >
                  Carrito
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-boutique-rose-pastel transition-colors text-sm"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-boutique-rose-pastel transition-colors text-sm"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-poppins font-semibold mb-4">Servicio al Cliente</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shipping"
                  className="text-gray-400 hover:text-boutique-rose-pastel transition-colors text-sm"
                >
                  Envíos
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-gray-400 hover:text-boutique-rose-pastel transition-colors text-sm"
                >
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-boutique-rose-pastel transition-colors text-sm"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-boutique-rose-pastel transition-colors text-sm"
                >
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-poppins font-semibold mb-4">Contáctanos</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-gray-400 text-sm">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>La Paz, Bolivia</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone size={16} className="flex-shrink-0" />
                <span>+591 123 4567</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail size={16} className="flex-shrink-0" />
                <span>info@thebutik.com</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center space-x-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-boutique-rose-pastel hover:text-boutique-black-matte transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-boutique-rose-pastel hover:text-boutique-black-matte transition-all"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm font-poppins">
            © {new Date().getFullYear()} THEBUTIK. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
