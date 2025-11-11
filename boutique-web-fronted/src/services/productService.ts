// Service para productos - Conectado al backend Django

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  search?: string;
  featured?: boolean;
  new?: boolean;
  page?: number;
  limit?: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const productService = {
  // Obtener productos desde Django
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/productos/productos/`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        console.error('Error al cargar productos:', response.status);
        throw new Error('Error al cargar productos');
      }
      
      const data = await response.json();
      
      // El backend retorna un array directo, no un objeto con products
      const products = Array.isArray(data) ? data : [];
      
      return {
        products: products,
        total: products.length,
        page: filters.page || 1,
        totalPages: Math.ceil(products.length / (filters.limit || 12)),
      };
    } catch (error) {
      console.error('Error en getProducts:', error);
      // Retornar respuesta vacía en caso de error
      return {
        products: [],
        total: 0,
        page: 1,
        totalPages: 1,
      };
    }
  },

  // Obtener producto por ID
  getProductById: async (id: number): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_URL}/api/productos/productos/${id}/`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        console.error('Producto no encontrado:', id);
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getProductById:', error);
      return null;
    }
  },

  // Obtener productos destacados
  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/api/productos/productos/?es_destacado=true`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error en getFeaturedProducts:', error);
      return [];
    }
  },

  // Obtener productos nuevos
  getNewProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/api/productos/productos/?es_nuevo=true`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error en getNewProducts:', error);
      return [];
    }
  },

  // Buscar productos
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/api/productos/productos/?search=${query}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error en searchProducts:', error);
      return [];
    }
  },

  // Obtener categorías disponibles
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_URL}/api/productos/categorias/`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      // Extraer nombres de categorías
      if (Array.isArray(data)) {
        return data.map((cat: any) => cat.nombre || cat.name);
      }
      return [];
    } catch (error) {
      console.error('Error en getCategories:', error);
      return [];
    }
  },
};
