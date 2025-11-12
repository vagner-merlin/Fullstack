/**
 * Servicio para manejar las imágenes de productos desde S3
 * Usa directamente el endpoint /api/productos/imagenes/
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ImageInfo {
  id: number;
  imagen: string;
  imagen_url: string;
  texto: string;
  es_principal: boolean;
  Producto_categoria: number;
}

export interface ImageResponse {
  count?: number;
  results?: ImageInfo[];
}

export interface ImageFilters {
  Producto_categoria?: number;
  es_principal?: boolean;
}

class ImageService {
  private baseURL = `${API_BASE_URL}/api/productos`;

  /**
   * Obtener imágenes con filtros opcionales usando el endpoint directo
   */
  async getImages(filters?: ImageFilters): Promise<ImageInfo[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.Producto_categoria) {
        params.append('Producto_categoria', filters.Producto_categoria.toString());
      }
      if (filters?.es_principal !== undefined) {
        params.append('es_principal', filters.es_principal.toString());
      }

      const url = `${this.baseURL}/imagenes/${params.toString() ? `?${params.toString()}` : ''}`;
      
      console.log('🖼️ ImageService: Fetching images from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ImageResponse | ImageInfo[] = await response.json();
      
      // El endpoint puede devolver { results: [...] } o directamente [...]
      let images: ImageInfo[] = [];
      
      if (Array.isArray(data)) {
        images = data;
      } else if (data.results) {
        images = data.results;
      }
      
      console.log('✅ ImageService: Images loaded successfully:', images);
      
      return images;
    } catch (error) {
      console.error('❌ ImageService: Error fetching images:', error);
      return [];
    }
  }

  /**
   * Obtener imagen específica por ID
   */
  async getImageById(imageId: number): Promise<ImageInfo | null> {
    try {
      const url = `${this.baseURL}/imagenes/${imageId}/`;
      
      console.log('🖼️ ImageService: Fetching single image from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ImageInfo = await response.json();
      
      console.log('✅ ImageService: Single image loaded successfully:', data);
      
      return data;
    } catch (error) {
      console.error('❌ ImageService: Error fetching single image:', error);
      return null;
    }
  }

  /**
   * Obtener todas las imágenes de una variante específica (ProductoCategoria)
   */
  async getVariantImages(variantId: number): Promise<ImageInfo[]> {
    return this.getImages({ Producto_categoria: variantId });
  }

  /**
   * Obtener imagen principal de una variante específica
   */
  async getVariantMainImage(variantId: number): Promise<ImageInfo | null> {
    try {
      const images = await this.getImages({ 
        Producto_categoria: variantId, 
        es_principal: true 
      });
      
      if (images && images.length > 0) {
        return images[0];
      }
      
      // Si no hay imagen principal, devolver la primera imagen disponible
      const allImages = await this.getVariantImages(variantId);
      if (allImages && allImages.length > 0) {
        return allImages[0];
      }
      
      return null;
    } catch (error) {
      console.error('❌ ImageService: Error fetching variant main image:', error);
      return null;
    }
  }

  /**
   * Obtener imagen principal de un producto (primera variante)
   */
  async getProductMainImage(productId: number): Promise<ImageInfo | null> {
    try {
      // Buscar cualquier imagen y devolver la primera principal
      const images = await this.getImages({ es_principal: true });
      
      if (images && images.length > 0) {
        return images[0];
      }
      
      return null;
    } catch (error) {
      console.error('❌ ImageService: Error fetching product main image:', error);
      return null;
    }
  }

  /**
   * Obtener todas las imágenes principales (para catálogo)
   */
  async getAllMainImages(): Promise<ImageInfo[]> {
    return this.getImages({ es_principal: true });
  }

  /**
   * Crear URL de imagen con fallback
   */
  createImageUrl(imageInfo: ImageInfo | null, fallback: string = '/placeholder-product.jpg'): string {
    if (!imageInfo?.imagen_url) {
      return fallback;
    }
    return imageInfo.imagen_url;
  }

  /**
   * Obtener texto alternativo para imagen
   */
  getImageAlt(imageInfo: ImageInfo): string {
    if (imageInfo.texto) {
      return imageInfo.texto;
    }
    
    return 'Imagen de producto';
  }

  /**
   * Verificar si una imagen está disponible
   */
  isImageAvailable(imageInfo: ImageInfo | null): boolean {
    return !!(imageInfo?.imagen_url);
  }
}

export const imageService = new ImageService();
export default imageService;
