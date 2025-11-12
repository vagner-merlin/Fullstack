/**
 * Servicio de Gestión de Clientes
 * Conectado con API Backend Django
 */

import apiClient from '../apiClient';

// Interfaz del modelo Cliente con información de Usuario
export interface Client {
  id: number;
  telefono: string;
  fecha_creacion: string;
  fecha_nacimiento: string;
  usuario: number;
  usuario_info: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    date_joined: string;
    last_login: string | null;
  };
  usuario_email: string;
  usuario_nombre_completo: string;
  usuario_activo: boolean;
}

// Respuesta de la API para lista de clientes
interface ClientsListResponse {
  success: boolean;
  count: number;
  clientes: Client[];
}

// Respuesta de la API para un solo cliente
interface ClientResponse {
  success: boolean;
  cliente: Client;
  message?: string;
}

// Respuesta para activar/desactivar
interface ToggleActiveResponse {
  success: boolean;
  message: string;
  cliente: Client;
  is_active?: boolean;
}

/**
 * Obtiene todos los clientes
 */
export const getAllClients = async (): Promise<Client[]> => {
  try {
    const response = await apiClient.get<ClientsListResponse>('/clientes/clientes/');
    return response.data.clientes || [];
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
};

/**
 * Obtiene un cliente por ID
 */
export const getClientById = async (id: number): Promise<Client> => {
  try {
    const response = await apiClient.get<ClientResponse>(`/clientes/clientes/${id}/`);
    return response.data.cliente;
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    throw error;
  }
};

/**
 * Obtiene solo clientes activos
 */
export const getActiveClients = async (): Promise<Client[]> => {
  try {
    const response = await apiClient.get<ClientsListResponse>('/clientes/clientes/activos/');
    return response.data.clientes || [];
  } catch (error) {
    console.error('Error al obtener clientes activos:', error);
    throw error;
  }
};

/**
 * Obtiene solo clientes inactivos
 */
export const getInactiveClients = async (): Promise<Client[]> => {
  try {
    const response = await apiClient.get<ClientsListResponse>('/clientes/clientes/inactivos/');
    return response.data.clientes || [];
  } catch (error) {
    console.error('Error al obtener clientes inactivos:', error);
    throw error;
  }
};

/**
 * Activa/Desactiva un cliente (toggle)
 */
export const toggleClientActive = async (id: number): Promise<Client> => {
  try {
    const response = await apiClient.patch<ToggleActiveResponse>(`/clientes/clientes/${id}/toggle_active/`);
    return response.data.cliente;
  } catch (error) {
    console.error('Error al cambiar estado del cliente:', error);
    throw error;
  }
};

/**
 * Establece el estado activo de un cliente
 */
export const setClientActive = async (id: number, isActive: boolean): Promise<Client> => {
  try {
    const response = await apiClient.patch<ClientResponse>(`/clientes/clientes/${id}/set_active/`, {
      is_active: isActive
    });
    return response.data.cliente;
  } catch (error) {
    console.error('Error al establecer estado del cliente:', error);
    throw error;
  }
};

/**
 * Elimina un cliente y su usuario asociado (cascada)
 */
export const deleteClient = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/clientes/clientes/${id}/`);
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    throw error;
  }
};

/**
 * Busca clientes por nombre, email o teléfono
 */
export const searchClients = async (searchTerm: string): Promise<Client[]> => {
  try {
    const clients = await getAllClients();
    if (!searchTerm.trim()) {
      return clients;
    }
    
    const term = searchTerm.toLowerCase();
    return clients.filter(
      c => 
        c.usuario_nombre_completo.toLowerCase().includes(term) ||
        c.usuario_email.toLowerCase().includes(term) ||
        c.telefono.includes(term) ||
        c.usuario_info.username.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Error al buscar clientes:', error);
    return [];
  }
};
