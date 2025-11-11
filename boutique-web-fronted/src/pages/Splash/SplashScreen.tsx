import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Mostrar splash por 2.5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Navegar a landing después de la animación de salida
      setTimeout(() => {
        navigate('/home');
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-gradient-to-br from-boutique-beige via-white to-boutique-rose-light flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            {/* Logo Animado */}
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="mb-8 inline-block"
            >
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <path
                  d="M60 15L15 37.5L60 60L105 37.5L60 15Z"
                  fill="#E5C5B5"
                  stroke="#1A1A1A"
                  strokeWidth="3"
                />
                <path
                  d="M15 60L60 82.5L105 60"
                  stroke="#1A1A1A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M15 82.5L60 105L105 82.5"
                  stroke="#1A1A1A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Nombre de la marca */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-raleway text-5xl md:text-6xl font-bold text-boutique-black-matte tracking-wider mb-4"
            >
              THEBUTIK
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="font-poppins text-lg text-gray-600 italic"
            >
              Elegancia que define tu estilo
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12"
            >
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-3 h-3 bg-boutique-rose rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
