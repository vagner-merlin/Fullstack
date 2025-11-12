import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart, AlertCircle } from 'lucide-react';
import type { BackendProduct, BackendVariant } from '../../services/productService';
import { useCart } from '../../context/CartContext';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: BackendProduct;
}

const AddToCartModal = ({ isOpen, onClose, product }: AddToCartModalProps) => {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<BackendVariant | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Obtener opciones únicas de colores y tallas
  const colors = [...new Set(product.variantes.map(v => v.color).filter(Boolean))];
  const sizes = [...new Set(product.variantes.map(v => v.talla).filter(Boolean))];

  // Buscar la variante seleccionada
  useEffect(() => {
    if (selectedColor || selectedSize) {
      const variant = product.variantes.find(v => 
        (!selectedColor || v.color === selectedColor) &&
        (!selectedSize || v.talla === selectedSize)
      );
      setSelectedVariant(variant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColor, selectedSize, product.variantes]);

  // Reset al abrir modal
  useEffect(() => {
    if (isOpen) {
      setSelectedColor('');
      setSelectedSize('');
      setQuantity(1);
      setSelectedVariant(null);
    }
  }, [isOpen]);

  const handleAddToCart = async () => {
    if (selectedVariant) {
      setIsAddingToCart(true);
      try {
        // Crear item del carrito con la información de la variante seleccionada
        const cartItem = {
          id: Date.now(), // ID temporal para localStorage
          producto_variante_id: selectedVariant.id,
          nombre: product.nombre,
          precio: parseFloat(selectedVariant.precio_unitario),
          cantidad: quantity,
          talla: selectedVariant.talla,
          color: selectedVariant.color,
          imagen: selectedVariant.imagen_principal?.imagen_url || selectedVariant.imagen_principal?.imagen,
          stock_disponible: selectedVariant.stock,
        };
        
        addItem(cartItem);
        onClose();
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const canAddToCart = selectedVariant && 
    selectedVariant.stock > 0 && 
    quantity <= selectedVariant.stock &&
    (colors.length === 0 || selectedColor) &&
    (sizes.length === 0 || selectedSize) &&
    !isAddingToCart;

  const maxQuantity = selectedVariant ? selectedVariant.stock : 1;
  const isOutOfStock = selectedVariant && selectedVariant.stock === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-gray-200">
                <div className="flex-1">
                  <h2 className="text-xl font-raleway font-bold text-boutique-black-matte mb-1">
                    Añadir al Carrito
                  </h2>
                  <h3 className="text-lg font-poppins text-gray-700">
                    {product.nombre}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Product Image */}
                {selectedVariant?.imagen_principal && (
                  <div className="flex justify-center">
                    <img
                      src={selectedVariant.imagen_principal.imagen_url || selectedVariant.imagen_principal.imagen}
                      alt={product.nombre}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {/* Color Selection */}
                {colors.length > 0 && (
                  <div>
                    <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">
                      Color *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`p-3 rounded-lg border-2 text-sm font-poppins transition-all ${
                            selectedColor === color
                              ? 'border-boutique-rose bg-boutique-rose/10 text-boutique-rose'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {sizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">
                      Talla *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`p-3 rounded-lg border-2 text-sm font-poppins transition-all ${
                            selectedSize === size
                              ? 'border-boutique-rose bg-boutique-rose/10 text-boutique-rose'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">
                    Cantidad
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={16} />
                    </button>
                    
                    <span className="text-xl font-poppins font-semibold min-w-[3ch] text-center">
                      {quantity}
                    </span>
                    
                    <button
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity}
                      className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  {selectedVariant && (
                    <p className="text-sm text-gray-500 mt-2">
                      Stock disponible: {selectedVariant.stock} unidades
                    </p>
                  )}
                </div>

                {/* Stock Alert */}
                {selectedVariant && isOutOfStock && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                    <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-poppins font-semibold text-red-700">Sin Stock</p>
                      <p className="text-sm text-red-600">Esta variante no está disponible actualmente.</p>
                    </div>
                  </div>
                )}

                {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center space-x-3">
                    <AlertCircle className="text-orange-500 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-poppins font-semibold text-orange-700">Stock Limitado</p>
                      <p className="text-sm text-orange-600">Solo quedan {selectedVariant.stock} unidades disponibles.</p>
                    </div>
                  </div>
                )}

                {/* Price */}
                {selectedVariant && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-poppins text-gray-700">Precio unitario:</span>
                      <span className="font-raleway font-bold text-lg">
                        ${parseFloat(selectedVariant.precio_unitario).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                      <span className="font-poppins font-semibold text-gray-900">Total:</span>
                      <span className="font-raleway font-bold text-xl text-boutique-rose">
                        ${(parseFloat(selectedVariant.precio_unitario) * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-poppins font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart}
                    className="flex-1 px-4 py-3 bg-boutique-rose text-white rounded-lg font-poppins font-semibold hover:bg-boutique-rose-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Agregando...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        <span>Agregar al Carrito</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddToCartModal;