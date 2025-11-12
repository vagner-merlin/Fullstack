import { motion } from 'framer-motion';
import { Star, Info, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../services/productService';
import { useState } from 'react';
import FavoriteButton from './FavoriteButton';
import ProductDetailModal from './ProductDetailModal';
import AddToCartModal from './AddToCartModal';
import { showToast } from '../../utils/toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  const finalPrice = product.discount
    ? (Number(product.price) || 0) * (1 - (Number(product.discount) || 0) / 100)
    : (Number(product.price) || 0);

  // Usar la primera imagen disponible del producto
  const mainImageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder-product.jpg';

  console.log('🖼️ ProductCard - Producto:', product.name, 'Imagen:', mainImageUrl);

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDetailModal(true);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.backendData) {
      showToast.error('No se pudieron cargar los datos del producto');
      return;
    }

    setShowAddToCartModal(true);
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <div 
            onClick={handleImageClick}
            className="cursor-pointer group-hover:cursor-zoom-in"
          >
            <img
              src={mainImageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                console.error('❌ Error al cargar imagen:', mainImageUrl);
                (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
              }}
            />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-boutique-gold text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full shadow-md">
                NUEVO
              </span>
            )}
            {product.discount && (
              <span className="bg-boutique-rose text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full shadow-md">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Info Button */}
            <button
              onClick={handleImageClick}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
              title="Ver detalles del producto"
            >
              <Info size={16} className="text-boutique-rose" />
            </button>
            
            {/* Favorite Button */}
            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white">
              <FavoriteButton
                productId={product.id}
                productData={{
                  id: product.id,
                  nombre: product.name,
                  precio: product.price,
                  imagen_principal: mainImageUrl,
                  categoria: product.category,
                  stock_disponible: product.stock,
                }}
              />
            </div>
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-sm font-raleway line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs font-poppins text-gray-500 uppercase tracking-wider mb-1">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-raleway font-semibold text-boutique-black-matte text-base mb-2 line-clamp-2 group-hover:text-boutique-rose transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(product.rating)
                      ? 'fill-boutique-gold text-boutique-gold'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 font-poppins">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            {product.discount ? (
              <>
                <span className="text-lg font-raleway font-bold text-boutique-rose">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="text-sm font-poppins text-gray-400 line-through">
                  ${(Number(product.price) || 0).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-raleway font-bold text-boutique-black-matte">
                ${(Number(product.price) || 0).toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Info */}
          {(Number(product.stock) || 0) < 5 && (Number(product.stock) || 0) > 0 && (
            <p className="text-xs text-orange-500 font-poppins mt-2">
              ¡Solo quedan {Number(product.stock) || 0}!
            </p>
          )}
          {(Number(product.stock) || 0) === 0 && (
            <p className="text-xs text-red-500 font-poppins font-semibold mt-2">
              Agotado
            </p>
          )}

          {/* Add to Cart Button */}
          {(Number(product.stock) || 0) > 0 && (
            <button
              onClick={handleAddToCartClick}
              className="w-full mt-4 px-4 py-2 bg-boutique-rose text-white rounded-lg font-poppins font-semibold hover:bg-boutique-rose-dark transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              <ShoppingCart size={16} />
              <span>Añadir al Carrito</span>
            </button>
          )}
        </div>
      </Link>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        productData={product.backendData || null}
      />

      {/* Add to Cart Modal */}
      {product.backendData && (
        <AddToCartModal
          isOpen={showAddToCartModal}
          onClose={() => setShowAddToCartModal(false)}
          product={product.backendData}
        />
      )}
    </motion.div>
  );
};

export default ProductCard;
