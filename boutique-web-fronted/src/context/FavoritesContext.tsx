import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Favorite } from '../services/favoriteService';
import { getFavorites, addFavorite, removeFavoriteByProductId } from '../services/favoriteService';
import { useAuth } from '../hooks/useAuth';
import { showToast } from '../utils/toast';

interface ProductData {
  id: number;
  nombre: string;
  precio: number;
  imagen_principal: string;
  categoria?: string;
  stock_disponible: number;
}

interface FavoritesContextType {
  favorites: Favorite[];
  loading: boolean;
  addToFavorites: (productId: number, productData: ProductData) => Promise<void>;
  removeFromFavorites: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export { FavoritesContext };
export type { FavoritesContextType, ProductData };

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Cargar favoritos al montar o cuando cambia el usuario
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId: number, productData: ProductData) => {
    try {
      await addFavorite({
        product_id: productId,
        product: {
          id: productData.id,
          nombre: productData.nombre,
          precio: productData.precio,
          imagen_principal: productData.imagen_principal,
          categoria: productData.categoria,
          stock_disponible: productData.stock_disponible,
        },
      });
      showToast.success(`${productData.nombre} añadido a favoritos`);
      await loadFavorites(); // Recargar lista
    } catch (error) {
      console.error('Error al añadir a favoritos:', error);
      showToast.error('Este producto ya está en favoritos');
      throw error;
    }
  };

  const removeFromFavorites = async (productId: number) => {
    try {
      await removeFavoriteByProductId(productId);
      showToast.info('Eliminado de favoritos');
      await loadFavorites(); // Recargar lista
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
      showToast.error('Error al eliminar de favoritos');
      throw error;
    }
  };

  const checkIsFavorite = (productId: number): boolean => {
    return favorites.some(f => f.product_id === productId);
  };

  const refreshFavorites = async () => {
    await loadFavorites();
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        isFavorite: checkIsFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
