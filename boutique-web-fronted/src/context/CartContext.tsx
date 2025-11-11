/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { showToast } from '../utils/toast';

// Tipos para el carrito
export interface CartItem {
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

export interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (inventario_id: number) => void;
  updateQuantity: (inventario_id: number, cantidad: number) => void;
  clearCart: () => void;
  isInCart: (inventario_id: number) => boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error al cargar carrito:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.inventario_id === item.inventario_id);
      
      if (existingItem) {
        // Si ya existe, actualizar cantidad
        const newQuantity = Math.min(existingItem.cantidad + item.cantidad, item.stock_disponible);
        showToast.success(`Cantidad actualizada: ${newQuantity} unidades`);
        return prev.map((i) =>
          i.inventario_id === item.inventario_id
            ? { ...i, cantidad: newQuantity }
            : i
        );
      }
      
      // Si no existe, agregar nuevo item
      showToast.success(`${item.nombre} añadido al carrito`);
      return [...prev, item];
    });
  };

  const removeItem = (inventario_id: number) => {
    setItems((prev) => {
      const removedItem = prev.find((item) => item.inventario_id === inventario_id);
      if (removedItem) {
        showToast.info(`${removedItem.nombre} eliminado del carrito`);
      }
      return prev.filter((item) => item.inventario_id !== inventario_id);
    });
  };

  const updateQuantity = (inventario_id: number, cantidad: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.inventario_id === inventario_id
          ? { ...item, cantidad: Math.min(Math.max(1, cantidad), item.stock_disponible) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const isInCart = (inventario_id: number) => {
    return items.some((item) => item.inventario_id === inventario_id);
  };

  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);
  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const value = {
    items,
    itemCount,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
