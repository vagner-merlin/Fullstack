import { useState, useEffect } from 'react';
import { Search, Barcode, X } from 'lucide-react';
import type { Product } from '../../services/productService';
import { productService } from '../../services/productService';

interface QuickProductSearchProps {
  onProductSelect: (product: Product) => void;
}

export const QuickProductSearch = ({ onProductSelect }: QuickProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ limit: 1000 });
      setProducts(response.products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered.slice(0, 8)); // Máximo 8 resultados
      setShowResults(true);
    } else {
      setFilteredProducts([]);
      setShowResults(false);
    }
  }, [searchTerm, products]);

  const handleSelect = (product: Product) => {
    onProductSelect(product);
    setSearchTerm('');
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, código o categoría..."
          className="w-full pl-12 pr-20 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          autoFocus
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-14 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-100 rounded-lg">
          <Barcode className="h-5 w-5 text-indigo-600" />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg p-4 border border-gray-200 z-50">
          <p className="text-center text-gray-600">Cargando productos...</p>
        </div>
      )}

      {/* Results Dropdown */}
      {showResults && filteredProducts.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border-2 border-gray-200 z-50 max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => {
            const finalPrice = product.discount 
              ? product.price * (1 - product.discount / 100) 
              : product.price;

            return (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className="w-full flex items-center gap-4 p-4 hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
              >
                {product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{product.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600">Stock: {product.stock}</span>
                    {product.stock <= 5 && (
                      <span className="text-xs text-red-600 font-medium">¡Bajo!</span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-indigo-600">
                    Bs {finalPrice.toFixed(2)}
                  </p>
                  {product.discount && product.discount > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      Bs {product.price.toFixed(2)}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {showResults && searchTerm && filteredProducts.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200 z-50">
          <p className="text-center text-gray-600">
            No se encontraron productos con "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};
