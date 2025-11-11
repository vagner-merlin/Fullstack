/**
 * Servicio de Administración de Productos
 * Conectado con Backend Django - Solo productos base (no variantes)
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface AdminProduct {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  peso: string; // DecimalField en backend
  fecha_creacion: string;
  categoria_id?: number; // ID de categoría opcional
}

export interface CreateProductData {
  nombre: string;
  descripcion: string;
  activo?: boolean;
  peso: string; // Decimal como string para evitar problemas de precisión
}

/**
 * Obtiene el token de autenticación
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Obtiene todos los productos desde la API
 */
export const getAllProducts = async (): Promise<AdminProduct[]> => {
  try {
    const response = await fetch(`${API_URL}/api/productos/productos/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }

    const data = await response.json();
    console.log('📦 Productos obtenidos:', data);
    
    // La API retorna { success: true, count: X, productos: [...] }
    return data.productos || data.results || [];
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    throw error;
  }
};

/**
 * Obtiene un producto por ID
 */
export const getProductById = async (id: number): Promise<AdminProduct | null> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/productos/productos/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Token ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener producto');
    }

    const data = await response.json();
    // La API retorna { success: true, producto: {...} }
    return data.producto || data;
  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    return null;
  }
};

/**
 * Crea un nuevo producto
 */
export const createProduct = async (data: CreateProductData): Promise<AdminProduct> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    console.log('📤 Creando producto:', data);

    const response = await fetch(`${API_URL}/api/productos/productos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        nombre: data.nombre,
        descripcion: data.descripcion,
        activo: data.activo !== undefined ? data.activo : true,
        peso: data.peso,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear producto');
    }

    const newProduct = await response.json();
    console.log('✅ Producto creado:', newProduct);
    return newProduct;
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    throw error;
  }
};

/**
 * Actualiza un producto existente
 */
export const updateProduct = async (
  id: number,
  data: Partial<CreateProductData>
): Promise<AdminProduct> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    console.log('📤 Actualizando producto:', id, data);

    const response = await fetch(`${API_URL}/api/productos/productos/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar producto');
    }

    const updatedProduct = await response.json();
    console.log('✅ Producto actualizado:', updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    throw error;
  }
};

/**
 * Elimina un producto
 */
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    console.log('🗑️ Eliminando producto:', id);

    const response = await fetch(`${API_URL}/api/productos/productos/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al eliminar producto' }));
      throw new Error(error.message || 'Error al eliminar producto');
    }

    console.log('✅ Producto eliminado exitosamente');
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    throw error;
  }
};
