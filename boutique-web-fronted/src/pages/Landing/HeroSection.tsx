import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative bg-[#E5C5B5] min-h-[90vh] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 space-y-8"
          >
            {/* Collection Tag */}
            <p className="font-raleway text-xl md:text-2xl italic text-gray-700">
              Colección de otoño
            </p>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="font-raleway text-6xl md:text-8xl font-bold text-boutique-black-matte uppercase leading-none tracking-tight">
                SON NUEVAS
              </h1>
              <h1 className="font-raleway text-6xl md:text-8xl font-bold text-boutique-black-matte uppercase leading-none tracking-tight">
                LLEGADAS
              </h1>
            </div>

            {/* Description */}
            <p className="font-poppins text-gray-600 text-base md:text-lg max-w-md leading-relaxed opacity-70">
              Fusce pharetra rutrum metus, in consequat velit malesuada vitae. Nunc ultrices maximus metus, sed auctor arcu tincidunt nec.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#8B6B5C] text-white px-10 py-4 font-poppins font-medium uppercase tracking-wider hover:bg-[#7A5A4B] transition-all shadow-lg text-sm"
                >
                  ¡Cómpralo ahora!
                </motion.button>
              </Link>
            </div>

            {/* Decorative Dots Pattern */}
            <div className="absolute left-0 bottom-20 md:bottom-32 opacity-40">
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-boutique-black-matte"
                  />
                ))}
              </div>
            </div>

            {/* Decorative Lines */}
            <div className="absolute right-0 bottom-16 opacity-30">
              <svg width="100" height="50" viewBox="0 0 100 50">
                <line x1="0" y1="10" x2="100" y2="0" stroke="#1A1A1A" strokeWidth="1.5" />
                <line x1="0" y1="25" x2="100" y2="15" stroke="#1A1A1A" strokeWidth="1.5" />
              </svg>
            </div>
          </motion.div>

          {/* Right Content - Product Images */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-full flex items-center"
          >
            {/* 50% OFF Badge - Positioned absolutely */}
            <div className="absolute top-0 right-0 md:right-8 z-30">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <div className="absolute inset-0 bg-[#7A9B7E] transform rotate-12 shadow-xl flex items-center justify-center">
                  <div className="text-white text-center transform -rotate-12">
                    <p className="text-xs tracking-wider mb-1">01 dn</p>
                    <p className="text-5xl md:text-6xl font-bold leading-none">50%</p>
                    <p className="text-xs tracking-wider mt-1">OFF</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="w-full grid grid-cols-1 gap-6 mt-8 md:mt-0">
              {/* Top Image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative bg-white rounded-2xl overflow-hidden shadow-xl aspect-[4/3]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-8xl mb-4">👗</div>
                    <p className="font-poppins text-gray-600 font-medium">Colección Rosa Pastel</p>
                  </div>
                </div>
              </motion.div>

              {/* Bottom Image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative bg-white rounded-2xl overflow-hidden shadow-xl aspect-[4/3]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🛍️</div>
                    <p className="font-poppins text-gray-600 font-medium">Elegancia beige</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
