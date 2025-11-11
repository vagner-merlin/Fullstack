import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Promotions = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-raleway text-4xl md:text-5xl font-bold text-boutique-black-matte mb-4">
            Promociones Especiales
          </h2>
          <p className="font-poppins text-gray-600 max-w-2xl mx-auto text-lg">
            Aprovecha nuestras ofertas exclusivas y renueva tu guardarropa con estilo
          </p>
        </motion.div>

        {/* Promotions Cards - Minimalist Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <Link to="/shop?category=winter">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all h-full">
                <div className="text-6xl mb-4">❄️</div>
                <h3 className="font-raleway text-2xl font-bold text-boutique-black-matte mb-2">
                  Colección de Invierno
                </h3>
                <p className="font-poppins text-gray-500 text-sm mb-4">
                  Descubre las últimas tendencias
                </p>
                <div className="inline-block bg-blue-50 text-blue-900 px-4 py-2 rounded-full font-bold text-sm">
                  30% OFF
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Link to="/shop?category=sale">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all h-full">
                <div className="text-6xl mb-4">🏷️</div>
                <h3 className="font-raleway text-2xl font-bold text-boutique-black-matte mb-2">
                  Ofertas Especiales
                </h3>
                <p className="font-poppins text-gray-500 text-sm mb-4">
                  Productos seleccionados
                </p>
                <div className="inline-block bg-rose-50 text-rose-900 px-4 py-2 rounded-full font-bold text-sm">
                  50% OFF
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <Link to="/shop?category=bestsellers">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all h-full">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="font-raleway text-2xl font-bold text-boutique-black-matte mb-2">
                  Lo Más Vendido
                </h3>
                <p className="font-poppins text-gray-500 text-sm mb-4">
                  Favoritos de nuestras clientas
                </p>
                <div className="inline-block bg-amber-50 text-amber-900 px-4 py-2 rounded-full font-bold text-sm">
                  Best Sellers
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="font-raleway text-3xl font-bold text-boutique-black-matte text-center mb-10">
            Explora por Categoría
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Vestidos', emoji: '👗', path: 'vestidos' },
              { name: 'Blusas', emoji: '👚', path: 'blusas' },
              { name: 'Pantalones', emoji: '👖', path: 'pantalones' },
              { name: 'Accesorios', emoji: '👜', path: 'accesorios' },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={`/shop?category=${category.path}`}>
                  <div className="bg-gray-50 rounded-2xl p-8 text-center hover:bg-gray-100 transition-all border border-gray-100">
                    <div className="text-5xl mb-3">{category.emoji}</div>
                    <p className="font-poppins font-semibold text-boutique-black-matte">
                      {category.name}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-boutique-black-matte text-white px-12 py-4 font-poppins font-medium uppercase tracking-wider hover:bg-gray-800 transition-all shadow-lg rounded-full text-sm"
            >
              Ver Todo el Catálogo
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Promotions;
