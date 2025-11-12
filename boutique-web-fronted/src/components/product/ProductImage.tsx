import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, AlertCircle } from 'lucide-react';
import { imageService, type ImageInfo } from '../../services/imageService';

interface ProductImageProps {
  productId?: number;
  variantId?: number;
  className?: string;
  showFallback?: boolean;
  alt?: string;
  onImageLoad?: (image: ImageInfo) => void;
  onImageError?: (error: string) => void;
}

const ProductImage = ({
  productId,
  variantId,
  className = "w-full h-64 object-cover rounded-lg",
  showFallback = true,
  alt,
  onImageLoad,
  onImageError
}: ProductImageProps) => {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (!productId && !variantId) {
        setError('Se requiere productId o variantId');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        let image: ImageInfo | null = null;

        if (variantId) {
          // Buscar imagen principal de la variante específica
          image = await imageService.getVariantMainImage(variantId);
        } else if (productId) {
          // Buscar imagen principal del producto
          image = await imageService.getProductMainImage(productId);
        }

        if (image) {
          setImageInfo(image);
          onImageLoad?.(image);
        } else {
          setError('No se encontró imagen principal');
          onImageError?.('No se encontró imagen principal');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        onImageError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [productId, variantId, onImageLoad, onImageError]);

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  if (error || !imageInfo) {
    if (!showFallback) return null;
    
    return (
      <div className={`${className} bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300`}>
        <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-xs text-gray-500 text-center px-2">
          {error || 'Sin imagen'}
        </p>
      </div>
    );
  }

  return (
    <motion.img
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      src={imageInfo.imagen_url || '/placeholder-product.jpg'}
      alt={alt || imageService.getImageAlt(imageInfo)}
      className={className}
      onError={(e) => {
        console.error('Error loading image:', imageInfo.imagen_url);
        if (showFallback) {
          (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
        }
      }}
    />
  );
};

export default ProductImage;