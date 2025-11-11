import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Minus, Plus, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import type { Product } from '../../services/productService';
import FavoriteButton from './FavoriteButton';

interface ProductInfoProps {
  product: Product;
  onAddedToCart?: () => void;
}

const ProductInfo = ({ product, onAddedToCart }: ProductInfoProps) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      alert('Por favor selecciona una talla');
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      alert('Por favor selecciona un color');
      return;
    }

    addItem({
      id: product.id,
      producto_id: product.id,
      nombre: product.name,
      precio: finalPrice,
      cantidad: quantity,
      talla: selectedSize,
      color: selectedColor,
      imagen: product.images[0],
      inventario_id: product.id, // Temporal - luego vendrá del backend
      stock_disponible: product.stock,
    });

    if (onAddedToCart) {
      onAddedToCart();
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <span className="inline-block text-sm font-poppins text-gray-500 uppercase tracking-wider">
          {product.category}
        </span>
      </div>

      {/* Product Name */}
      <h1 className="font-raleway text-3xl md:text-4xl font-bold text-boutique-black-matte leading-tight">
        {product.name}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={`${
                i < Math.floor(product.rating)
                  ? 'fill-boutique-gold text-boutique-gold'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-poppins text-gray-600">
          {product.rating} ({product.reviews} reseñas)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 py-4 border-y border-gray-200">
        {product.discount ? (
          <>
            <span className="text-4xl font-raleway font-bold text-boutique-rose">
              ${finalPrice.toFixed(2)}
            </span>
            <span className="text-2xl font-poppins text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
            <span className="bg-boutique-rose text-white text-sm font-poppins font-semibold px-3 py-1 rounded-full">
              -{product.discount}%
            </span>
          </>
        ) : (
          <span className="text-4xl font-raleway font-bold text-boutique-black-matte">
            ${product.price.toFixed(2)}
          </span>
        )}
      </div>

      {/* Description */}
      <div>
        <p className="font-poppins text-gray-700 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Size Selection */}
      {product.sizes.length > 0 && (
        <div>
          <label className="block text-sm font-raleway font-semibold text-boutique-black-matte mb-3">
            Talla
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <motion.button
                key={size}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSize(size)}
                className={`px-5 py-2.5 rounded-lg font-poppins font-medium transition-all ${
                  selectedSize === size
                    ? 'bg-boutique-black-matte text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-boutique-black-matte'
                }`}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {product.colors.length > 0 && (
        <div>
          <label className="block text-sm font-raleway font-semibold text-boutique-black-matte mb-3">
            Color
          </label>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedColor(color)}
                className={`px-5 py-2.5 rounded-lg font-poppins font-medium transition-all ${
                  selectedColor === color
                    ? 'bg-boutique-black-matte text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-boutique-black-matte'
                }`}
              >
                {color}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-raleway font-semibold text-boutique-black-matte mb-3">
          Cantidad
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={18} />
            </button>
            <span className="px-6 py-3 font-poppins font-semibold text-lg border-x-2 border-gray-200">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= product.stock}
              className="px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
            </button>
          </div>
          <span className="text-sm font-poppins text-gray-600">
            {product.stock > 0
              ? `${product.stock} disponibles`
              : 'Agotado'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 bg-boutique-black-matte text-white py-4 px-6 rounded-lg font-poppins font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <ShoppingCart size={20} />
          <span>Añadir al carrito</span>
        </motion.button>

        <div className="p-2 rounded-lg border-2 border-gray-200 hover:border-boutique-rose transition-colors">
          <FavoriteButton
            productId={product.id}
            productData={{
              id: product.id,
              nombre: product.name,
              precio: product.price,
              imagen_principal: product.images[0],
              categoria: product.category,
              stock_disponible: product.stock,
            }}
            className="p-2"
          />
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="flex items-start gap-3">
          <div className="bg-boutique-rose-light p-3 rounded-lg">
            <Truck size={20} className="text-boutique-rose" />
          </div>
          <div>
            <p className="font-raleway font-semibold text-sm text-boutique-black-matte">
              Envío Gratis
            </p>
            <p className="font-poppins text-xs text-gray-600">
              En compras +$50
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-boutique-rose-light p-3 rounded-lg">
            <Shield size={20} className="text-boutique-rose" />
          </div>
          <div>
            <p className="font-raleway font-semibold text-sm text-boutique-black-matte">
              Compra Segura
            </p>
            <p className="font-poppins text-xs text-gray-600">
              Pago 100% protegido
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-boutique-rose-light p-3 rounded-lg">
            <RefreshCw size={20} className="text-boutique-rose" />
          </div>
          <div>
            <p className="font-raleway font-semibold text-sm text-boutique-black-matte">
              Devoluciones
            </p>
            <p className="font-poppins text-xs text-gray-600">
              30 días para cambios
            </p>
          </div>
        </div>
      </div>

      {/* Stock Warning */}
      {product.stock > 0 && product.stock < 5 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-lg p-4"
        >
          <p className="text-sm font-poppins text-orange-700">
            ⚠️ ¡Solo quedan {product.stock} unidades! Aprovecha antes de que se agoten.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProductInfo;
