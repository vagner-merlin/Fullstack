/**
 * Servicio de Imágenes de Productos
 * Conectado con Backend Django y S3
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ProductImage {
  id: number;
  imagen: string | null;
  imagen_url: string | null;
  texto: string;
  es_principal: boolean;
  Producto_categoria: number;
}

export interface CreateProductImageData {
  imagen: File;
  texto: string;
  es_principal: boolean;
  Producto_categoria: number;
}

/**
 * Obtiene el token de autenticación
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Obtiene todas las imágenes
 */
export const getAllImages = async (): Promise<ProductImage[]> => {
  try {
    const response = await fetch(`${API_URL}/api/productos/imagenes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener imágenes');
    }

    const data = await response.json();
    console.log('🖼️ Imágenes obtenidas:', data);
    
    return data.results || data;
  } catch (error) {
    console.error('❌ Error al obtener imágenes:', error);
    throw error;
  }
};

/**
 * Obtiene imágenes de una variante específica
 */
export const getImagesByVariant = async (variantId: number): Promise<ProductImage[]> => {
  try {
    const response = await fetch(`${API_URL}/api/productos/imagenes/?producto_categoria=${variantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener imágenes de la variante');
    }

    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('❌ Error al obtener imágenes de la variante:', error);
    throw error;
  }
};

/**
 * Obtiene una imagen específica
 */
export const getImageById = async (id: number): Promise<ProductImage> => {
  try {
    const response = await fetch(`${API_URL}/api/productos/imagenes/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener imagen');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener imagen:', error);
    throw error;
  }
};

/**
 * Sube una nueva imagen (con archivo)
 */
export const uploadImage = async (imageData: CreateProductImageData): Promise<ProductImage> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Crear FormData para enviar archivo
    const formData = new FormData();
    formData.append('imagen', imageData.imagen);
    formData.append('texto', imageData.texto);
    formData.append('es_principal', imageData.es_principal.toString());
    formData.append('Producto_categoria', imageData.Producto_categoria.toString());

    // Usar la nueva API dedicada para upload a S3
    const response = await fetch(`${API_URL}/api/productos/upload-imagen/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        // NO incluir 'Content-Type' - el navegador lo establece automáticamente con boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error del servidor:', errorData);
      throw new Error(errorData.error || 'Error al subir imagen');
    }

    const data = await response.json();
    console.log('✅ Imagen subida exitosamente a S3:', data);
    console.log('📍 URL de la imagen:', data.imagen?.imagen_url);
    console.log('🔧 Debug info:', data.debug);
    
    return data.imagen;
  } catch (error) {
    console.error('❌ Error al subir imagen:', error);
    throw error;
  }
};

/**
 * Actualiza una imagen existente
 */
export const updateImage = async (
  id: number, 
  imageData: Partial<{ texto: string; es_principal: boolean; imagen?: File }>
): Promise<ProductImage> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const formData = new FormData();
    if (imageData.texto !== undefined) {
      formData.append('texto', imageData.texto);
    }
    if (imageData.es_principal !== undefined) {
      formData.append('es_principal', imageData.es_principal.toString());
    }
    if (imageData.imagen) {
      formData.append('imagen', imageData.imagen);
    }

    const response = await fetch(`${API_URL}/api/productos/imagenes/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar imagen');
    }

    const data = await response.json();
    console.log('✅ Imagen actualizada:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al actualizar imagen:', error);
    throw error;
  }
};

/**
 * Elimina una imagen
 */
export const deleteImage = async (id: number): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/productos/imagenes/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar imagen');
    }

    console.log('✅ Imagen eliminada');
  } catch (error) {
    console.error('❌ Error al eliminar imagen:', error);
    throw error;
  }
};

/**
 * Marca una imagen como principal (y desmarca otras del mismo producto)
 */
export const setAsPrincipal = async (id: number): Promise<ProductImage> => {
  try {
    return await updateImage(id, { es_principal: true });
  } catch (error) {
    console.error('❌ Error al marcar imagen como principal:', error);
    throw error;
  }
};

/**
 * Verifica la configuración de S3 en el backend
 */
export const checkS3Configuration = async (): Promise<any> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/productos/upload-imagen/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al verificar configuración de S3');
    }

    const data = await response.json();
    console.log('🔧 Configuración S3:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al verificar S3:', error);
    throw error;
  }
};
