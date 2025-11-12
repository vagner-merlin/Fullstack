/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { showToast } from '../utils/toast';
import { cartService } from '../services/cartService';
import type { CartItem as ServerCartItem } from '../services/cartService';

// Tipos para el carrito local (localStorage)
export interface LocalCartItem {
  id: number;
  producto_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  talla?: string;
  color?: string;
  imagen?: string;
  inventario_id: number;
  stock_disponible: number;
}

// Tipo unificado para el contexto
export interface CartItem {
  id: number;
  producto_variante_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  talla?: string;
  color?: string;
  imagen?: string;
  stock_disponible: number;
  // Campos adicionales del servidor
  servidor_item_id?: number; // ID del item en el servidor
}

export interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  isLoading: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string | number) => void;
  updateQuantity: (itemId: string | number, cantidad: number) => void;
  clearCart: () => void;
  isInCart: (producto_variante_id: number) => boolean;
  syncWithServer: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función para convertir item del servidor al formato local
  const serverItemToLocal = (serverItem: ServerCartItem): CartItem => {
    return {
      id: serverItem.id,
      producto_variante_id: serverItem.producto_variante,
      nombre: serverItem.variante_info?.producto?.nombre || 'Producto',
      precio: parseFloat(serverItem.variante_info?.precio_unitario || '0'),
      cantidad: serverItem.cantidad,
      talla: serverItem.variante_info?.talla || undefined,
      color: serverItem.variante_info?.color || undefined,
      imagen: serverItem.imagen_principal || undefined,
      stock_disponible: serverItem.variante_info?.stock || 0,
      servidor_item_id: serverItem.id,
    };
  };

  // Sincronizar con el servidor
  const syncWithServer = async () => {
    if (!cartService.isAuthenticated()) {
      console.log('🔒 CartContext: Usuario no autenticado, usando localStorage');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 CartContext: Sincronizando con servidor...');
      
      const serverCart = await cartService.getCart();
      if (serverCart) {
        console.log('✅ CartContext: Carrito del servidor obtenido:', serverCart);
        const serverItems = serverCart.items.map(serverItemToLocal);
        setItems(serverItems);
        
        // Limpiar localStorage ya que usamos el servidor
        localStorage.removeItem('cart');
      } else {
        console.log('📦 CartContext: No hay carrito en el servidor');
        setItems([]);
      }
    } catch (error) {
      console.error('❌ CartContext: Error sincronizando con servidor:', error);
      showToast.error('Error al cargar carrito del servidor');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar carrito al iniciar
  useEffect(() => {
    const loadCart = async () => {
      if (cartService.isAuthenticated()) {
        // Usuario autenticado: cargar del servidor
        await syncWithServer();
      } else {
        // Usuario no autenticado: cargar desde localStorage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          try {
            setItems(JSON.parse(storedCart));
            console.log('📱 CartContext: Carrito cargado desde localStorage');
          } catch (error) {
            console.error('❌ CartContext: Error al cargar carrito desde localStorage:', error);
            localStorage.removeItem('cart');
          }
        }
      }
    };

    loadCart();
  }, []);

  // Guardar en localStorage solo si no está autenticado
  useEffect(() => {
    if (!cartService.isAuthenticated() && items.length >= 0) {
      localStorage.setItem('cart', JSON.stringify(items));
      console.log('💾 CartContext: Carrito guardado en localStorage');
    }
  }, [items]);

  const addItem = async (item: CartItem) => {
    if (cartService.isAuthenticated()) {
      // Usuario autenticado: agregar al servidor
      try {
        const result = await cartService.addItem({
          producto_variante_id: item.producto_variante_id,
          cantidad: item.cantidad
        });

        if (result.success) {
          showToast.success(result.message);
          await syncWithServer(); // Recargar desde servidor
        } else {
          showToast.error(result.message);
        }
      } catch (error) {
        console.error('Error adding item to server cart:', error);
        showToast.error('Error al agregar al carrito');
      }
    } else {
      // Usuario no autenticado: agregar a localStorage
      setItems((prev) => {
        const existingItem = prev.find((i) => i.producto_variante_id === item.producto_variante_id);
        
        if (existingItem) {
          const newQuantity = Math.min(existingItem.cantidad + item.cantidad, item.stock_disponible);
          showToast.success(`Cantidad actualizada: ${newQuantity} unidades`);
          return prev.map((i) =>
            i.producto_variante_id === item.producto_variante_id
              ? { ...i, cantidad: newQuantity }
              : i
          );
        }
        
        showToast.success(`${item.nombre} añadido al carrito`);
        return [...prev, item];
      });
    }
  };

  const removeItem = async (itemId: string | number) => {
    if (cartService.isAuthenticated()) {
      // Usuario autenticado: eliminar del servidor
      const item = items.find(i => i.id === itemId);
      if (item && item.servidor_item_id) {
        try {
          const result = await cartService.removeItem({ item_id: item.servidor_item_id });
          if (result.success) {
            showToast.info(result.message);
            await syncWithServer();
          } else {
            showToast.error(result.message);
          }
        } catch (error) {
          console.error('Error removing item from server cart:', error);
          showToast.error('Error al eliminar del carrito');
        }
      }
    } else {
      // Usuario no autenticado: eliminar de localStorage
      setItems((prev) => {
        const removedItem = prev.find((item) => item.id === itemId);
        if (removedItem) {
          showToast.info(`${removedItem.nombre} eliminado del carrito`);
        }
        return prev.filter((item) => item.id !== itemId);
      });
    }
  };

  const updateQuantity = async (itemId: string | number, cantidad: number) => {
    if (cartService.isAuthenticated()) {
      // Usuario autenticado: actualizar en servidor
      const item = items.find(i => i.id === itemId);
      if (item && item.servidor_item_id) {
        try {
          const result = await cartService.updateItem({
            item_id: item.servidor_item_id,
            cantidad: cantidad
          });
          if (result.success) {
            await syncWithServer();
          } else {
            showToast.error(result.message);
          }
        } catch (error) {
          console.error('Error updating item in server cart:', error);
          showToast.error('Error al actualizar carrito');
        }
      }
    } else {
      // Usuario no autenticado: actualizar localStorage
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, cantidad: Math.min(Math.max(1, cantidad), item.stock_disponible) }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (cartService.isAuthenticated()) {
      // Usuario autenticado: vaciar carrito del servidor
      try {
        const result = await cartService.clearCart();
        if (result.success) {
          showToast.success(result.message);
          setItems([]);
        } else {
          showToast.error(result.message);
        }
      } catch (error) {
        console.error('Error clearing server cart:', error);
        showToast.error('Error al vaciar carrito');
      }
    } else {
      // Usuario no autenticado: limpiar localStorage
      setItems([]);
      localStorage.removeItem('cart');
      showToast.success('Carrito vaciado');
    }
  };

  const isInCart = (producto_variante_id: number) => {
    return items.some((item) => item.producto_variante_id === producto_variante_id);
  };

  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);
  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const value = {
    items,
    itemCount,
    total,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    syncWithServer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};
