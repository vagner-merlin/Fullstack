/**
 * Servicio de Variantes de Productos (ProductoCategoria)
 * Conectado con Backend Django
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ProductVariant {
  id: number;
  producto: number;
  categoria: number;
  color: string;
  talla: string;
  capacidad: string;
  precio_variante: string;
  precio_unitario: string;
  stock: number;
  fecha_creacion: string;
  producto_info?: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  categoria_info?: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  imagen_principal?: {
    id: number;
    Producto_url: string;
    texto: string;
    es_principal: boolean;
  };
}

export interface CreateVariantData {
  producto: number;
  categoria: number;
  color: string;
  talla: string;
  capacidad: string;
  precio_variante: string;
  precio_unitario: string;
  stock: number;
}

/**
 * Obtiene el token de autenticación
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Obtiene todas las variantes
 */
export const getAllVariants = async (): Promise<ProductVariant[]> => {
  try {
    const response = await fetch(`${API_URL}/api/productos/variantes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener variantes');
    }

    const data = await response.json();
    console.log('🎨 Variantes obtenidas:', data);
    
    // La API puede retornar { count: X, results: [...] } o directamente el array
    return data.results || data;
  } catch (error) {
    console.error('❌ Error al obtener variantes:', error);
    throw error;
  }
};

/**
 * Obtiene variantes de un producto específico
 */
export const getVariantsByProduct = async (productId: number): Promise<ProductVariant[]> => {
  try {
    const response = await fetch(`${API_URL}/api/productos/variantes/?producto=${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener variantes del producto');
    }

    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('❌ Error al obtener variantes del producto:', error);
    throw error;
  }
};

/**
 * Obtiene una variante específica
 */
export const getVariantById = async (id: number): Promise<ProductVariant> => {
  try {
    const response = await fetch(`${API_URL}/api/productos/variantes/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener variante');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener variante:', error);
    throw error;
  }
};

/**
 * Crea una nueva variante
 */
export const createVariant = async (variantData: CreateVariantData): Promise<ProductVariant> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/productos/variantes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(variantData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error del servidor:', errorData);
      throw new Error(errorData.message || 'Error al crear variante');
    }

    const data = await response.json();
    console.log('✅ Variante creada:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al crear variante:', error);
    throw error;
  }
};

/**
 * Actualiza una variante existente
 */
export const updateVariant = async (id: number, variantData: Partial<CreateVariantData>): Promise<ProductVariant> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/productos/variantes/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(variantData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar variante');
    }

    const data = await response.json();
    console.log('✅ Variante actualizada:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al actualizar variante:', error);
    throw error;
  }
};

/**
 * Elimina una variante
 */
export const deleteVariant = async (id: number): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/productos/variantes/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar variante');
    }

    console.log('✅ Variante eliminada');
  } catch (error) {
    console.error('❌ Error al eliminar variante:', error);
    throw error;
  }
};

/**
 * Obtiene variantes disponibles (con stock)
 */
export const getAvailableVariants = async (): Promise<ProductVariant[]> => {
  try {
    const response = await fetch(`${API_URL}/api/productos/variantes/disponibles/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener variantes disponibles');
    }

    const data = await response.json();
    return data.variantes || data.results || data;
  } catch (error) {
    console.error('❌ Error al obtener variantes disponibles:', error);
    throw error;
  }
};
