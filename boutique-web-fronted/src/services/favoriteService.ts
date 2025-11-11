/**
 * Servicio de Favoritos
 * Gestiona las operaciones CRUD de productos favoritos
 * Persistencia en localStorage (simulando backend)
 */

export interface Favorite {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  // Información del producto (desnormalizada para mostrar en lista)
  product: {
    id: number;
    nombre: string;
    precio: number;
    imagen_principal: string;
    categoria?: string;
    stock_disponible: number;
  };
}

interface CreateFavoriteData {
  product_id: number;
  product: {
    id: number;
    nombre: string;
    precio: number;
    imagen_principal: string;
    categoria?: string;
    stock_disponible: number;
  };
}

const FAVORITES_KEY = 'boutique_favorites';

/**
 * Obtiene todos los favoritos del usuario actual
 */
export const getFavorites = async (): Promise<Favorite[]> => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Usuario no autenticado');
    }
    
    const user = JSON.parse(userStr);
    const favoritesStr = localStorage.getItem(`${FAVORITES_KEY}_${user.id}`);
    
    if (!favoritesStr) {
      return [];
    }
    
    const favorites: Favorite[] = JSON.parse(favoritesStr);
    
    // Ordenar por fecha de creación (más recientes primero)
    return favorites.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return [];
  }
};

/**
 * Añade un producto a favoritos
 */
export const addFavorite = async (data: CreateFavoriteData): Promise<Favorite> => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Usuario no autenticado');
    }
    
    const user = JSON.parse(userStr);
    const favorites = await getFavorites();
    
    // Verificar si ya existe en favoritos
    const exists = favorites.find(f => f.product_id === data.product_id);
    if (exists) {
      throw new Error('El producto ya está en favoritos');
    }
    
    // Crear nuevo favorito
    const newFavorite: Favorite = {
      id: Date.now(), // ID único basado en timestamp
      user_id: user.id,
      product_id: data.product_id,
      created_at: new Date().toISOString(),
      product: data.product,
    };
    
    // Guardar en localStorage
    const updatedFavorites = [newFavorite, ...favorites];
    localStorage.setItem(
      `${FAVORITES_KEY}_${user.id}`,
      JSON.stringify(updatedFavorites)
    );
    
    return newFavorite;
  } catch (error) {
    console.error('Error al añadir favorito:', error);
    throw error;
  }
};

/**
 * Elimina un favorito por ID
 */
export const removeFavorite = async (favoriteId: number): Promise<void> => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Usuario no autenticado');
    }
    
    const user = JSON.parse(userStr);
    const favorites = await getFavorites();
    
    // Filtrar el favorito a eliminar
    const updatedFavorites = favorites.filter(f => f.id !== favoriteId);
    
    // Guardar en localStorage
    localStorage.setItem(
      `${FAVORITES_KEY}_${user.id}`,
      JSON.stringify(updatedFavorites)
    );
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    throw error;
  }
};

/**
 * Elimina un favorito por product_id
 */
export const removeFavoriteByProductId = async (productId: number): Promise<void> => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Usuario no autenticado');
    }
    
    const user = JSON.parse(userStr);
    const favorites = await getFavorites();
    
    // Filtrar el favorito a eliminar
    const updatedFavorites = favorites.filter(f => f.product_id !== productId);
    
    // Guardar en localStorage
    localStorage.setItem(
      `${FAVORITES_KEY}_${user.id}`,
      JSON.stringify(updatedFavorites)
    );
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    throw error;
  }
};

/**
 * Verifica si un producto está en favoritos
 */
export const isFavorite = async (productId: number): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(f => f.product_id === productId);
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    return false;
  }
};

/**
 * Obtiene el favorito de un producto específico
 */
export const getFavoriteByProductId = async (productId: number): Promise<Favorite | null> => {
  try {
    const favorites = await getFavorites();
    return favorites.find(f => f.product_id === productId) || null;
  } catch (error) {
    console.error('Error al buscar favorito:', error);
    return null;
  }
};
