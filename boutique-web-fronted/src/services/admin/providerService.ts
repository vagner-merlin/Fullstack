/**
 * Servicio de Gestión de Proveedores
 * Conectado con API Backend Django
 */

import apiClient from '../apiClient';

// Interfaz del modelo Proveedor del backend
export interface Provider {
  id: number;
  nombre: string;
  nombre_contacto: string;
  telefono: string;
  email: string;
  direccion: string;
}

// Interfaz para crear/actualizar proveedor
export interface CreateProviderData {
  nombre: string;
  nombre_contacto: string;
  telefono: string;
  email: string;
  direccion: string;
}

// Respuesta de la API para lista de proveedores
interface ProvidersListResponse {
  success: boolean;
  count: number;
  proveedores: Provider[];
}

// Respuesta de la API para un solo proveedor
interface ProviderResponse {
  success: boolean;
  proveedor: Provider;
  message?: string;
}

/**
 * Obtiene todos los proveedores
 */
export const getAllProviders = async (): Promise<Provider[]> => {
  try {
    const response = await apiClient.get<ProvidersListResponse>('/compras/proveedores/');
    return response.data.proveedores || [];
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    throw error;
  }
};

/**
 * Obtiene un proveedor por ID
 */
export const getProviderById = async (id: number): Promise<Provider> => {
  try {
    const response = await apiClient.get<ProviderResponse>(`/compras/proveedores/${id}/`);
    return response.data.proveedor;
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    throw error;
  }
};

/**
 * Crea un nuevo proveedor
 */
export const createProvider = async (data: CreateProviderData): Promise<Provider> => {
  try {
    const response = await apiClient.post<ProviderResponse>('/compras/proveedores/', data);
    return response.data.proveedor;
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    throw error;
  }
};

/**
 * Actualiza un proveedor
 */
export const updateProvider = async (
  id: number,
  data: Partial<CreateProviderData>
): Promise<Provider> => {
  try {
    const response = await apiClient.put<ProviderResponse>(`/compras/proveedores/${id}/`, data);
    return response.data.proveedor;
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    throw error;
  }
};

/**
 * Actualiza parcialmente un proveedor
 */
export const patchProvider = async (
  id: number,
  data: Partial<CreateProviderData>
): Promise<Provider> => {
  try {
    const response = await apiClient.patch<ProviderResponse>(`/compras/proveedores/${id}/`, data);
    return response.data.proveedor;
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    throw error;
  }
};

/**
 * Elimina un proveedor
 */
export const deleteProvider = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/compras/proveedores/${id}/`);
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    throw error;
  }
};

/**
 * Busca proveedores por nombre
 */
export const searchProviders = async (searchTerm: string): Promise<Provider[]> => {
  try {
    const providers = await getAllProviders();
    if (!searchTerm.trim()) {
      return providers;
    }
    
    const term = searchTerm.toLowerCase();
    return providers.filter(
      p => 
        p.nombre.toLowerCase().includes(term) ||
        p.nombre_contacto.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Error al buscar proveedores:', error);
    return [];
  }
};
