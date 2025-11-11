import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilter from '../../components/product/ProductFilter';
import { productService } from '../../services/productService';
import type { ProductFilters, Product } from '../../services/productService';

const ShopPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await productService.getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productService.getProducts(filters);
        setProducts(response.products);
        setTotalPages(response.totalPages);
        setTotal(response.total);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [filters]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters({ ...newFilters, limit: filters.limit });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-white to-boutique-gray-soft min-h-screen">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-boutique-black-matte mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-poppins text-sm">Volver</span>
              </button>

              <h1 className="font-raleway text-4xl md:text-5xl font-bold text-boutique-black-matte mb-4">
                Catálogo de Productos
              </h1>
              <p className="font-poppins text-gray-600 text-lg">
                Descubre nuestra colección completa
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-8">
          {/* Filter Component */}
          <ProductFilter
            onFilterChange={handleFilterChange}
            initialFilters={filters}
            categories={categories}
          />

          {/* Results Count */}
          {!isLoading && (
            <div className="mb-6">
              <p className="font-poppins text-gray-600">
                Mostrando{' '}
                <span className="font-semibold text-boutique-black-matte">
                  {products.length}
                </span>{' '}
                de{' '}
                <span className="font-semibold text-boutique-black-matte">
                  {total}
                </span>{' '}
                productos
              </p>
            </div>
          )}

          {/* Product Grid */}
          <ProductGrid products={products} isLoading={isLoading} />

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 flex items-center justify-center gap-2"
            >
              <button
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Mostrar solo algunas páginas
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= filters.page! - 1 && page <= filters.page! + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-poppins font-medium transition-colors ${
                          filters.page === page
                            ? 'bg-boutique-rose text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === filters.page! - 2 ||
                    page === filters.page! + 2
                  ) {
                    return <span key={page} className="w-10 h-10 flex items-center justify-center">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={filters.page === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default ShopPage;
