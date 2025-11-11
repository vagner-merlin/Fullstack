import { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '../../hooks/useFavorites';

interface FavoriteButtonProps {
  productId: number;
  productData: {
    id: number;
    nombre: string;
    precio: number;
    imagen_principal: string;
    categoria?: string;
    stock_disponible: number;
  };
  className?: string;
  showText?: boolean;
}

export default function FavoriteButton({ 
  productId, 
  productData, 
  className = '',
  showText = false 
}: FavoriteButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const isFav = isFavorite(productId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    try {
      if (isFav) {
        await removeFromFavorites(productId);
      } else {
        await addToFavorites(productId, productData);
      }
    } catch (error) {
      console.error('Error al gestionar favorito:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      className={`group flex items-center gap-2 ${className}`}
      whileTap={{ scale: 0.9 }}
      disabled={isAnimating}
    >
      <motion.div
        animate={{
          scale: isAnimating ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Heart
          className={`w-5 h-5 transition-all duration-300 ${
            isFav
              ? 'fill-boutique-rose text-boutique-rose'
              : 'text-gray-400 group-hover:text-boutique-rose group-hover:scale-110'
          }`}
        />
        
        {/* Efecto de partículas al añadir */}
        {isAnimating && !isFav && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full bg-boutique-rose/30"
          />
        )}
      </motion.div>
      
      {showText && (
        <span className="text-sm font-medium text-gray-700 group-hover:text-boutique-rose transition-colors">
          {isFav ? 'En favoritos' : 'Añadir a favoritos'}
        </span>
      )}
    </motion.button>
  );
}
