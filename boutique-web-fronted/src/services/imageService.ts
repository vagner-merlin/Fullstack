/**
 * Servicio para manejar las imágenes de productos desde S3
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ImageInfo {
  id: number;
  imagen_url: string | null;
  imagen_name: string | null;
  texto: string;
  es_principal: boolean;
  producto_categoria_id: number;
  producto_info: {
    id: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    peso: number | null;
  };
  categoria_info: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  variante_info: {
    color: string;
    talla: string;
    capacidad: string | null;
    precio_variante: number;
    precio_unitario: number;
    stock: number;
    fecha_creacion: string | null;
  };
  s3_info: {
    storage_backend: string;
    file_size: number | null;
    content_type: string | null;
  };
}

export interface ImageResponse {
  success: boolean;
  count: number;
  imagenes: ImageInfo[];
}

export interface SingleImageResponse {
  success: boolean;
  imagen: ImageInfo;
}

export interface ImageStatsResponse {
  success: boolean;
  estadisticas: {
    total_imagenes: number;
    imagenes_principales: number;
    imagenes_secundarias: number;
    productos_con_imagenes: number;
    categorias_con_imagenes: number;
    storage_backend: string;
  };
}

export interface ImageFilters {
  producto_categoria?: number;
  producto?: number;
  categoria?: number;
  principal?: boolean;
  imagen_id?: number;
}

class ImageService {
  private baseURL = `${API_BASE_URL}/api/productos`;

  /**
   * Obtener imágenes con filtros opcionales
   */
  async getImages(filters?: ImageFilters): Promise<ImageResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.producto_categoria) {
        params.append('producto_categoria', filters.producto_categoria.toString());
      }
      if (filters?.producto) {
        params.append('producto', filters.producto.toString());
      }
      if (filters?.categoria) {
        params.append('categoria', filters.categoria.toString());
      }
      if (filters?.principal !== undefined) {
        params.append('principal', filters.principal.toString());
      }
      if (filters?.imagen_id) {
        params.append('imagen_id', filters.imagen_id.toString());
      }

      const url = `${this.baseURL}/mostrar-imagenes/${params.toString() ? `?${params.toString()}` : ''}`;
      
      console.log('🖼️ ImageService: Fetching images from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ImageResponse = await response.json();
      
      console.log('✅ ImageService: Images loaded successfully:', data);
      
      return data;
    } catch (error) {
      console.error('❌ ImageService: Error fetching images:', error);
      throw error;
    }
  }

  /**
   * Obtener imagen específica por ID
   */
  async getImageById(imageId: number): Promise<SingleImageResponse> {
    try {
      const url = `${this.baseURL}/mostrar-imagenes/?imagen_id=${imageId}`;
      
      console.log('🖼️ ImageService: Fetching single image from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: SingleImageResponse = await response.json();
      
      console.log('✅ ImageService: Single image loaded successfully:', data);
      
      return data;
    } catch (error) {
      console.error('❌ ImageService: Error fetching single image:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las imágenes de un producto específico
   */
  async getProductImages(productId: number): Promise<ImageResponse> {
    return this.getImages({ producto: productId });
  }

  /**
   * Obtener imagen principal de un producto
   */
  async getProductMainImage(productId: number): Promise<ImageInfo | null> {
    try {
      const response = await this.getImages({ 
        producto: productId, 
        principal: true 
      });
      
      if (response.imagenes && response.imagenes.length > 0) {
        return response.imagenes[0];
      }
      
      return null;
    } catch (error) {
      console.error('❌ ImageService: Error fetching main image:', error);
      return null;
    }
  }

  /**
   * Obtener imagen principal de una variante específica
   */
  async getVariantMainImage(variantId: number): Promise<ImageInfo | null> {
    try {
      const response = await this.getImages({ 
        producto_categoria: variantId, 
        principal: true 
      });
      
      if (response.imagenes && response.imagenes.length > 0) {
        return response.imagenes[0];
      }
      
      return null;
    } catch (error) {
      console.error('❌ ImageService: Error fetching variant main image:', error);
      return null;
    }
  }

  /**
   * Obtener todas las imágenes principales (para catálogo)
   */
  async getAllMainImages(): Promise<ImageResponse> {
    return this.getImages({ principal: true });
  }

  /**
   * Obtener imágenes por categoría
   */
  async getCategoryImages(categoryId: number): Promise<ImageResponse> {
    return this.getImages({ categoria: categoryId });
  }

  /**
   * Obtener estadísticas de imágenes
   */
  async getImageStats(): Promise<ImageStatsResponse> {
    try {
      const url = `${this.baseURL}/estadisticas-imagenes/`;
      
      console.log('📊 ImageService: Fetching image stats from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ImageStatsResponse = await response.json();
      
      console.log('✅ ImageService: Image stats loaded successfully:', data);
      
      return data;
    } catch (error) {
      console.error('❌ ImageService: Error fetching image stats:', error);
      throw error;
    }
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
    
    const productName = imageInfo.producto_info?.nombre || 'Producto';
    const variant = imageInfo.variante_info ? 
      `${imageInfo.variante_info.color} - ${imageInfo.variante_info.talla}` : '';
    
    return `${productName} ${variant}`.trim();
  }

  /**
   * Verificar si una imagen está disponible
   */
  isImageAvailable(imageInfo: ImageInfo | null): boolean {
    return !!(imageInfo?.imagen_url && imageInfo.producto_info?.activo);
  }
}

export const imageService = new ImageService();
export default imageService;