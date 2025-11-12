// Servicio para carrito - Conectado al backend Django

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Interfaces para el carrito
export interface CartVariantInfo {
  id: number;
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    peso: string;
  };
  color: string;
  talla: string;
  capacidad: string;
  precio_unitario: string;
  stock: number;
}

export interface CartItem {
  id: number;
  carrito: number;
  producto_variante: number;
  cantidad: number;
  variante_info: CartVariantInfo;
  subtotal: number;
  imagen_principal: string | null;
}

export interface Cart {
  id: number;
  cliente: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  items: CartItem[];
  total_items: number;
  total_precio: number;
}

export interface AddItemRequest {
  producto_variante_id: number;
  cantidad: number;
}

export interface UpdateItemRequest {
  item_id: number;
  cantidad: number;
}

export interface RemoveItemRequest {
  item_id: number;
}

// Función helper para obtener token de autenticación
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Headers con autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` }),
  };
};

export const cartService = {
  // Obtener carrito del usuario autenticado
  getCart: async (): Promise<Cart | null> => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.log('📦 CartService: No hay token, usuario no autenticado');
        return null;
      }

      console.log('🛒 CartService: Obteniendo carrito del usuario...');
      const response = await fetch(`${API_URL}/api/carrito/carritos/mi_carrito/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('🔒 CartService: Token inválido o expirado');
          return null;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ CartService: Carrito obtenido:', data);
      
      return data.carrito;
    } catch (error) {
      console.error('❌ CartService: Error obteniendo carrito:', error);
      return null;
    }
  },

  // Agregar item al carrito
  addItem: async (request: AddItemRequest): Promise<{ success: boolean; message: string; item?: CartItem }> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'Debes iniciar sesión para agregar productos al carrito'
        };
      }

      console.log('➕ CartService: Agregando item al carrito:', request);
      const response = await fetch(`${API_URL}/api/carrito/carritos/agregar_item/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();
      console.log('📦 CartService: Respuesta agregar item:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Error ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: data.success,
        message: data.message,
        item: data.item
      };
    } catch (error) {
      console.error('❌ CartService: Error agregando item:', error);
      return {
        success: false,
        message: 'Error de conexión. Intenta de nuevo.'
      };
    }
  },

  // Actualizar cantidad de item
  updateItem: async (request: UpdateItemRequest): Promise<{ success: boolean; message: string; item?: CartItem }> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'Debes iniciar sesión para actualizar el carrito'
        };
      }

      console.log('📝 CartService: Actualizando item del carrito:', request);
      const response = await fetch(`${API_URL}/api/carrito/carritos/actualizar_item/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();
      console.log('📦 CartService: Respuesta actualizar item:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Error ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: data.success,
        message: data.message,
        item: data.item
      };
    } catch (error) {
      console.error('❌ CartService: Error actualizando item:', error);
      return {
        success: false,
        message: 'Error de conexión. Intenta de nuevo.'
      };
    }
  },

  // Eliminar item del carrito
  removeItem: async (request: RemoveItemRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'Debes iniciar sesión para eliminar items del carrito'
        };
      }

      console.log('🗑️ CartService: Eliminando item del carrito:', request);
      const response = await fetch(`${API_URL}/api/carrito/carritos/eliminar_item/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();
      console.log('📦 CartService: Respuesta eliminar item:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Error ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: data.success,
        message: data.message
      };
    } catch (error) {
      console.error('❌ CartService: Error eliminando item:', error);
      return {
        success: false,
        message: 'Error de conexión. Intenta de nuevo.'
      };
    }
  },

  // Vaciar carrito
  clearCart: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'Debes iniciar sesión para vaciar el carrito'
        };
      }

      console.log('🧹 CartService: Vaciando carrito...');
      const response = await fetch(`${API_URL}/api/carrito/carritos/vaciar_carrito/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      console.log('📦 CartService: Respuesta vaciar carrito:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Error ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: data.success,
        message: data.message
      };
    } catch (error) {
      console.error('❌ CartService: Error vaciando carrito:', error);
      return {
        success: false,
        message: 'Error de conexión. Intenta de nuevo.'
      };
    }
  },

  // Verificar si usuario está autenticado
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  }
};