import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ProductFilters } from '../../services/productService';

interface ProductFilterProps {
  onFilterChange: (filters: ProductFilters) => void;
  initialFilters?: ProductFilters;
  categories: string[];
}

const ProductFilter = ({
  onFilterChange,
  initialFilters = {},
  categories,
}: ProductFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleSearchChange = (search: string) => {
    const newFilters = { ...filters, search, page: 1 };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (category: string) => {
    const newFilters = { ...filters, category, page: 1 };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (minPrice?: number, maxPrice?: number) => {
    const newFilters = { ...filters, minPrice, maxPrice, page: 1 };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy: ProductFilters['sortBy']) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = { page: 1, limit: filters.limit };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters =
    filters.search ||
    (filters.category && filters.category !== 'todos') ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  return (
    <div className="mb-8">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-poppins font-medium transition-all ${
            showFilters
              ? 'bg-boutique-rose text-white'
              : 'bg-white border border-gray-200 text-boutique-black-matte hover:border-boutique-rose'
          }`}
        >
          <SlidersHorizontal size={20} />
          <span>Filtros</span>
          {hasActiveFilters && (
            <span className="bg-white text-boutique-rose text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
              !
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-gray-200 rounded-lg p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-raleway font-semibold text-boutique-black-matte mb-3">
                Categoría
              </label>
              <select
                value={filters.category || 'todos'}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'todos'
                      ? 'Todas las categorías'
                      : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-raleway font-semibold text-boutique-black-matte mb-3">
                Precio Mínimo
              </label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  handlePriceChange(
                    e.target.value ? Number(e.target.value) : undefined,
                    filters.maxPrice
                  )
                }
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-raleway font-semibold text-boutique-black-matte mb-3">
                Precio Máximo
              </label>
              <input
                type="number"
                placeholder="$9999"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  handlePriceChange(
                    filters.minPrice,
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-raleway font-semibold text-boutique-black-matte mb-3">
                Ordenar por
              </label>
              <select
                value={filters.sortBy || ''}
                onChange={(e) =>
                  handleSortChange(
                    e.target.value as ProductFilters['sortBy']
                  )
                }
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
              >
                <option value="">Predeterminado</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="newest">Más Nuevos</option>
                <option value="popular">Más Populares</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-boutique-rose hover:text-boutique-rose-dark font-poppins text-sm font-medium transition-colors"
              >
                <X size={16} />
                <span>Limpiar filtros</span>
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.search && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-boutique-rose-light text-boutique-black-matte rounded-full text-sm font-poppins">
              Búsqueda: "{filters.search}"
              <button
                onClick={() => handleSearchChange('')}
                className="hover:text-boutique-rose transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {filters.category && filters.category !== 'todos' && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-boutique-rose-light text-boutique-black-matte rounded-full text-sm font-poppins">
              {filters.category.charAt(0).toUpperCase() +
                filters.category.slice(1)}
              <button
                onClick={() => handleCategoryChange('todos')}
                className="hover:text-boutique-rose transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {filters.minPrice !== undefined && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-boutique-rose-light text-boutique-black-matte rounded-full text-sm font-poppins">
              Min: ${filters.minPrice}
              <button
                onClick={() => handlePriceChange(undefined, filters.maxPrice)}
                className="hover:text-boutique-rose transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {filters.maxPrice !== undefined && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-boutique-rose-light text-boutique-black-matte rounded-full text-sm font-poppins">
              Max: ${filters.maxPrice}
              <button
                onClick={() => handlePriceChange(filters.minPrice, undefined)}
                className="hover:text-boutique-rose transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
