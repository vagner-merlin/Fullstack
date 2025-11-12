/**
 * Servicio de Gestión de Inventario - Conectado con Backend Django
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ProductoBasico {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: string;
  peso: number;
}

export interface Inventario {
  id: number;
  cantidad_entradas: number;
  stock_minimo: number;
  stock_maximo: number;
  ubicacion_almacen: string;
  ultima_actualizacion: string;
  Producto_id: number;
  producto_info?: ProductoBasico;
}

export interface CreateInventarioData {
  cantidad_entradas: number;
  stock_minimo: number;
  stock_maximo: number;
  ubicacion_almacen: string;
  Producto_id: number;
}

export interface UpdateInventarioData {
  cantidad_entradas?: number;
  stock_minimo?: number;
  stock_maximo?: number;
  ubicacion_almacen?: string;
  Producto_id?: number;
}

export interface InventarioAlerts {
  stock_bajo: {
    count: number;
    items: Inventario[];
  };
  stock_alto: {
    count: number;
    items: Inventario[];
  };
}

/**
 * Obtiene el token de autenticación
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Obtiene todos los registros de inventario desde la API
 */
export const getAllInventario = async (): Promise<Inventario[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_URL}/api/productos/inventario/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener inventario');
    }

    const data = await response.json();
    console.log('📦 Inventario obtenido:', data);
    
    // La API retorna { success: true, count: X, inventario: [...] }
    return data.inventario || data.results || [];
  } catch (error) {
    console.error('❌ Error al obtener inventario:', error);
    throw error;
  }
};

/**
 * Obtiene un registro de inventario por ID
 */
export const getInventarioById = async (id: number): Promise<Inventario | null> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_URL}/api/productos/inventario/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener registro de inventario');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener registro de inventario:', error);
    return null;
  }
};

/**
 * Crea un nuevo registro de inventario
 */
export const createInventario = async (data: CreateInventarioData): Promise<Inventario> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    console.log('📤 Creando registro de inventario:', data);

    const response = await fetch(`${API_URL}/api/productos/inventario/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error del servidor:', errorData);
      throw new Error(errorData.message || 'Error al crear registro de inventario');
    }

    const result = await response.json();
    console.log('✅ Registro de inventario creado:', result);
    return result.inventario || result;
  } catch (error) {
    console.error('❌ Error al crear registro de inventario:', error);
    throw error;
  }
};

/**
 * Actualiza un registro de inventario
 */
export const updateInventario = async (
  id: number,
  data: UpdateInventarioData
): Promise<Inventario> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    console.log('📤 Actualizando registro de inventario:', id, data);

    const response = await fetch(`${API_URL}/api/productos/inventario/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error del servidor:', errorData);
      throw new Error(errorData.message || 'Error al actualizar registro de inventario');
    }

    const result = await response.json();
    console.log('✅ Registro de inventario actualizado:', result);
    return result.inventario || result;
  } catch (error) {
    console.error('❌ Error al actualizar registro de inventario:', error);
    throw error;
  }
};

/**
 * Elimina un registro de inventario
 */
export const deleteInventario = async (id: number): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    console.log('🗑️ Eliminando registro de inventario:', id);

    const response = await fetch(`${API_URL}/api/productos/inventario/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar registro de inventario');
    }

    console.log('✅ Registro de inventario eliminado');
  } catch (error) {
    console.error('❌ Error al eliminar registro de inventario:', error);
    throw error;
  }
};

/**
 * Obtiene productos con stock bajo
 */
export const getStockBajo = async (): Promise<Inventario[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_URL}/api/productos/inventario/stock_bajo/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener productos con stock bajo');
    }

    const data = await response.json();
    console.log('⚠️ Productos con stock bajo:', data);
    
    return data.inventario_bajo || [];
  } catch (error) {
    console.error('❌ Error al obtener productos con stock bajo:', error);
    throw error;
  }
};

/**
 * Obtiene alertas de inventario
 */
export const getAlertas = async (): Promise<InventarioAlerts> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_URL}/api/productos/inventario/alertas/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener alertas de inventario');
    }

    const data = await response.json();
    console.log('🚨 Alertas de inventario:', data);
    
    return data.alertas || { stock_bajo: { count: 0, items: [] }, stock_alto: { count: 0, items: [] } };
  } catch (error) {
    console.error('❌ Error al obtener alertas de inventario:', error);
    throw error;
  }
};

/**
 * Obtiene inventario filtrado por producto
 */
export const getInventarioByProducto = async (productoId: number): Promise<Inventario[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const response = await fetch(
      `${API_URL}/api/productos/inventario/?producto=${productoId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener inventario del producto');
    }

    const data = await response.json();
    return data.inventario || data.results || [];
  } catch (error) {
    console.error('❌ Error al obtener inventario del producto:', error);
    throw error;
  }
};

/**
 * Obtiene inventario filtrado por ubicación
 */
export const getInventarioByUbicacion = async (ubicacion: string): Promise<Inventario[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    const response = await fetch(
      `${API_URL}/api/productos/inventario/?ubicacion=${encodeURIComponent(ubicacion)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener inventario por ubicación');
    }

    const data = await response.json();
    return data.inventario || data.results || [];
  } catch (error) {
    console.error('❌ Error al obtener inventario por ubicación:', error);
    throw error;
  }
};
