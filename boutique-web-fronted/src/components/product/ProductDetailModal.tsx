import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Palette, Tag } from 'lucide-react';
import type { BackendProduct, BackendVariant } from '../../services/productService';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData: BackendProduct | null;
}

const ProductDetailModal = ({ isOpen, onClose, productData }: ProductDetailModalProps) => {
  if (!productData) return null;

  const formatPrice = (price: string) => {
    return parseFloat(price).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-boutique-rose to-boutique-gold p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
              
              <h2 className="text-2xl md:text-3xl font-raleway font-bold text-white pr-12">
                {productData.nombre}
              </h2>
              <p className="text-white/90 font-poppins mt-2">
                {productData.descripcion}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Basic Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-raleway font-semibold text-lg mb-4 flex items-center gap-2">
                    <Package size={20} className="text-boutique-rose" />
                    Información General
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-poppins text-gray-600">ID:</span>
                      <span className="font-poppins font-semibold">#{productData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-poppins text-gray-600">Peso:</span>
                      <span className="font-poppins font-semibold">{productData.peso} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-poppins text-gray-600">Estado:</span>
                      <span className={`font-poppins font-semibold ${productData.activo ? 'text-green-600' : 'text-red-600'}`}>
                        {productData.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-poppins text-gray-600">Creado:</span>
                      <span className="font-poppins font-semibold text-sm">
                        {formatDate(productData.fecha_creacion)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-raleway font-semibold text-lg mb-4 flex items-center gap-2">
                    <Tag size={20} className="text-boutique-gold" />
                    Categorías
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {productData.categorias.map((categoria) => (
                      <div
                        key={categoria.id}
                        className="bg-boutique-rose text-white px-3 py-1 rounded-full text-sm font-poppins"
                      >
                        {categoria.nombre}
                      </div>
                    ))}
                  </div>
                  {productData.categorias.length > 0 && (
                    <div className="mt-3 text-sm text-gray-600 font-poppins">
                      {productData.categorias[0].descripcion}
                    </div>
                  )}
                </div>
              </div>

              {/* Variants */}
              <div className="mb-6">
                <h3 className="font-raleway font-semibold text-xl mb-4 flex items-center gap-2">
                  <Palette size={20} className="text-boutique-rose" />
                  Variantes Disponibles ({productData.variantes.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productData.variantes.map((variante: BackendVariant) => (
                    <div key={variante.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      {/* Variant Image */}
                      {variante.imagen_principal && (
                        <div className="mb-3">
                          <img
                            src={variante.imagen_principal.imagen_url || variante.imagen_principal.imagen}
                            alt={variante.imagen_principal.texto}
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-product.jpg';
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Variant Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-poppins font-semibold">
                            {variante.color} - {variante.talla}
                          </h4>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            ID: #{variante.id}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Precio unitario:</span>
                          <span className="font-semibold text-boutique-rose">
                            ${formatPrice(variante.precio_unitario)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Precio variante:</span>
                          <span className="font-semibold">
                            ${formatPrice(variante.precio_variante)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Stock:</span>
                          <span className={`font-semibold ${
                            variante.stock > 5 ? 'text-green-600' : 
                            variante.stock > 0 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {variante.stock} unidades
                          </span>
                        </div>

                        {variante.capacidad && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Capacidad:</span>
                            <span className="font-semibold">{variante.capacidad}</span>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          Categoría: {variante.categoria_info.nombre}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="bg-gradient-to-r from-boutique-beige to-boutique-rose-light rounded-lg p-6">
                <h3 className="font-raleway font-semibold text-lg mb-4">Resumen del Producto</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-boutique-rose">
                      {productData.variantes.length}
                    </div>
                    <div className="text-sm text-gray-600 font-poppins">Variantes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-boutique-gold">
                      {[...new Set(productData.variantes.map(v => v.color))].length}
                    </div>
                    <div className="text-sm text-gray-600 font-poppins">Colores</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-boutique-rose">
                      {[...new Set(productData.variantes.map(v => v.talla))].length}
                    </div>
                    <div className="text-sm text-gray-600 font-poppins">Tallas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {productData.variantes.reduce((sum, v) => sum + v.stock, 0)}
                    </div>
                    <div className="text-sm text-gray-600 font-poppins">Stock Total</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;