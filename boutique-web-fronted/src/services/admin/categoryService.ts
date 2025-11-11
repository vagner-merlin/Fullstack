/**
 * Servicio de Gestión de Categorías - Conectado con Backend Django
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Subcategoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  id_padre: number | null; // null = categoría principal, número = subcategoría
  fecha_creacion: string;
  subcategorias?: Subcategoria[]; // Subcategorías hijas (si es categoría padre)
}

export interface CreateCategoryData {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
  id_padre?: number | null; // Para crear subcategorías
}

/**
 * Obtiene el token de autenticación
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Obtiene todas las categorías desde la API
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/api/productos/categorias/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener categorías');
    }

    const data = await response.json();
    console.log('📦 Categorías obtenidas:', data);
    
    // La API retorna { success: true, count: X, categorias: [...] }
    return data.categorias || data.results || [];
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    throw error;
  }
};

/**
 * Obtiene una categoría por ID
 */
export const getCategoryById = async (id: number): Promise<Category | null> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/productos/categorias/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Token ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener categoría');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener categoría:', error);
    return null;
  }
};

/**
 * Crea una nueva categoría
 */
export const createCategory = async (data: CreateCategoryData): Promise<Category> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    console.log('📤 Creando categoría:', data);

    const response = await fetch(`${API_URL}/api/productos/categorias/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        activo: data.activo !== undefined ? data.activo : true,
        id_padre: data.id_padre || null,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear categoría');
    }

    const newCategory = await response.json();
    console.log('✅ Categoría creada:', newCategory);
    return newCategory;
  } catch (error) {
    console.error('❌ Error al crear categoría:', error);
    throw error;
  }
};

/**
 * Actualiza una categoría
 */
export const updateCategory = async (
  id: number,
  data: Partial<CreateCategoryData>
): Promise<Category> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    console.log('📤 Actualizando categoría:', id, data);

    const response = await fetch(`${API_URL}/api/productos/categorias/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar categoría');
    }

    const updatedCategory = await response.json();
    console.log('✅ Categoría actualizada:', updatedCategory);
    return updatedCategory;
  } catch (error) {
    console.error('❌ Error al actualizar categoría:', error);
    throw error;
  }
};

/**
 * Elimina una categoría
 */
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    console.log('🗑️ Eliminando categoría:', id);

    const response = await fetch(`${API_URL}/api/productos/categorias/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al eliminar categoría' }));
      throw new Error(error.message || 'Error al eliminar categoría');
    }

    console.log('✅ Categoría eliminada exitosamente');
  } catch (error) {
    console.error('❌ Error al eliminar categoría:', error);
    throw error;
  }
};

/**
 * Obtiene las categorías principales (sin padre)
 */
export const getMainCategories = async (): Promise<Category[]> => {
  try {
    const allCategories = await getAllCategories();
    return allCategories.filter(c => !c.id_padre);
  } catch (error) {
    console.error('❌ Error al obtener categorías principales:', error);
    return [];
  }
};

/**
 * Obtiene las subcategorías de una categoría padre
 */
export const getSubcategories = async (parentId: number): Promise<Category[]> => {
  try {
    const allCategories = await getAllCategories();
    return allCategories.filter(c => c.id_padre === parentId);
  } catch (error) {
    console.error('❌ Error al obtener subcategorías:', error);
    return [];
  }
};
