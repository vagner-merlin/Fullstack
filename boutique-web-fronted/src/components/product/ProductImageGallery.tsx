import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageIcon, AlertCircle } from 'lucide-react';
import { imageService, type ImageInfo } from '../../services/imageService';

interface ProductImageGalleryProps {
  productId: number;
  className?: string;
  showThumbnails?: boolean;
  maxImages?: number;
}

const ProductImageGallery = ({
  productId,
  className = "w-full",
  showThumbnails = true,
  maxImages = 10
}: ProductImageGalleryProps) => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🖼️ ProductImageGallery: Loading images for product:', productId);
        
        const response = await imageService.getProductImages(productId);
        
        if (response.success && response.imagenes) {
          // Ordenar: imagen principal primero, luego las demás
          const sortedImages = response.imagenes
            .sort((a, b) => {
              if (a.es_principal && !b.es_principal) return -1;
              if (!a.es_principal && b.es_principal) return 1;
              return 0;
            })
            .slice(0, maxImages);

          console.log('✅ ProductImageGallery: Images loaded:', sortedImages.length);
          setImages(sortedImages);
          setCurrentImageIndex(0);
        } else {
          setError('No se encontraron imágenes para este producto');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        console.error('❌ ProductImageGallery: Error loading images:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadImages();
    }
  }, [productId, maxImages]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="aspect-square bg-gray-200 animate-pulse flex items-center justify-center rounded-lg">
          <ImageIcon className="w-16 h-16 text-gray-400" />
        </div>
        {showThumbnails && (
          <div className="flex gap-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-gray-200 animate-pulse rounded-md" />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className={className}>
        <div className="aspect-square bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">
            {error || 'No hay imágenes disponibles'}
          </p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <div className={className}>
      {/* Imagen Principal */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={currentImage.imagen_url || '/placeholder-product.jpg'}
            alt={imageService.getImageAlt(currentImage)}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              console.error('Error loading image:', currentImage.imagen_url);
              (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
            }}
          />
        </AnimatePresence>

        {/* Botones de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Indicadores */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Etiqueta de imagen principal */}
        {currentImage.es_principal && (
          <div className="absolute top-4 left-4">
            <span className="bg-boutique-rose text-white px-2 py-1 rounded-full text-xs font-medium">
              Principal
            </span>
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                index === currentImageIndex 
                  ? 'border-boutique-rose' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={image.imagen_url || '/placeholder-product.jpg'}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                }}
              />
              {image.es_principal && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-boutique-rose rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Información de la imagen actual */}
      {currentImage.texto && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 text-center">
            {currentImage.texto}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;