import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import ProductGallery from '../../components/product/ProductGallery';
import ProductInfo from '../../components/product/ProductInfo';
import { productService } from '../../services/productService';
import type { Product } from '../../services/productService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        console.error('❌ ProductDetailPage: No hay ID en params');
        return;
      }
      
      console.log(`📄 ProductDetailPage: Cargando variante con ID: ${id}`);
      setIsLoading(true);
      try {
        // Cargar datos de la variante específica
        const variant = await productService.getVariantById(Number(id));
        console.log('✅ ProductDetailPage: Variante cargada:', variant);
        
        if (!variant) {
          console.error('⚠️ ProductDetailPage: La variante no existe');
          setProduct(null);
          return;
        }
        
        // Convertir datos de variante a formato Product para los componentes existentes
        const images: string[] = [];
        
        // Agregar imagen principal primero si existe
        if (variant.imagen_principal) {
          const urlPrincipal = variant.imagen_principal.imagen_url || variant.imagen_principal.imagen;
          if (urlPrincipal) {
            images.push(urlPrincipal);
          }
        }
        
        // Agregar imágenes adicionales
        if (variant.imagenes && Array.isArray(variant.imagenes)) {
          variant.imagenes.forEach(img => {
            const url = img.imagen_url || img.imagen;
            if (url && !images.includes(url)) {
              images.push(url);
            }
          });
        }
        
        // Parsear tallas y colores (pueden venir separados por comas)
        const sizes = variant.talla ? variant.talla.split(',').map(s => s.trim()) : [];
        const colors = variant.color ? variant.color.split(',').map(c => c.trim()) : [];
        
        const productData: Product = {
          id: variant.id,
          name: variant.producto_info.nombre,
          description: variant.producto_info.descripcion,
          price: parseFloat(variant.precio_unitario),
          discount: 0,
          category: variant.categoria_info.nombre,
          images: images.length > 0 ? images : ['/placeholder-product.jpg'],
          sizes: sizes,
          colors: colors,
          stock: variant.stock,
          rating: 4.5,
          reviews: 0,
          isNew: false,
          isFeatured: false,
        };
        
        console.log('✅ ProductDetailPage: Producto mapeado:', productData);
        setProduct(productData);
        
      } catch (error) {
        console.error('❌ Error loading product:', error);
        if (error instanceof Error) {
          console.error('💬 Error details:', error.message);
        }
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  const handleAddedToCart = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-b from-white to-boutique-gray-soft">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Gallery Skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-gradient-to-br from-boutique-beige to-boutique-rose-light animate-pulse rounded-2xl" />
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                  ))}
                </div>
              </div>
              
              {/* Info Skeleton */}
              <div className="space-y-6">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
                <div className="h-10 bg-gray-200 animate-pulse rounded w-3/4" />
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3" />
                <div className="h-12 bg-gray-200 animate-pulse rounded w-1/2" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-b from-white to-boutique-gray-soft flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block p-8 bg-gradient-to-br from-boutique-beige to-boutique-rose-light rounded-full mb-6">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-raleway font-semibold text-boutique-black-matte mb-3">
              Producto no encontrado
            </h2>
            <p className="text-gray-600 font-poppins mb-6">
              El producto que buscas no existe o fue eliminado.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-boutique-black-matte text-white px-8 py-3 rounded-lg font-poppins font-medium hover:bg-gray-800 transition-colors"
            >
              Volver a la tienda
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-boutique-gray-soft">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-4">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-boutique-black-matte mb-3 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-poppins text-sm">Volver</span>
            </button>

            <div className="flex items-center space-x-2 text-sm font-poppins text-gray-600">
              <Link to="/" className="hover:text-boutique-black-matte transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-boutique-black-matte transition-colors">
                Tienda
              </Link>
              <span>/</span>
              <span className="text-boutique-black-matte font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ProductGallery images={product.images} productName={product.name} />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ProductInfo product={product} onAddedToCart={handleAddedToCart} />
            </motion.div>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 z-50"
          >
            <div className="bg-white rounded-full p-1">
              <Check size={20} className="text-green-500" />
            </div>
            <div>
              <p className="font-raleway font-semibold">¡Producto añadido!</p>
              <p className="font-poppins text-sm opacity-90">Se agregó al carrito correctamente</p>
            </div>
          </motion.div>
        )}
      </div>
    </PublicLayout>
  );
};

export default ProductDetailPage;
