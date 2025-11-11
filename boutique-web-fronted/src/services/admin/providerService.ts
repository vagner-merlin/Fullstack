/**
 * Servicio de Gestión de Proveedores
 */

export interface Provider {
  id: number;
  nombre: string;
  empresa: string;
  ruc?: string;
  telefono: string;
  email: string;
  direccion?: string;
  ciudad?: string;
  pais: string;
  productos_suministrados?: string[];
  activo: boolean;
  notas?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProviderData {
  nombre: string;
  empresa: string;
  ruc?: string;
  telefono: string;
  email: string;
  direccion?: string;
  ciudad?: string;
  pais: string;
  productos_suministrados?: string[];
  activo?: boolean;
  notas?: string;
}

const PROVIDERS_KEY = 'boutique_providers';

/**
 * Obtiene todos los proveedores
 */
export const getAllProviders = async (): Promise<Provider[]> => {
  try {
    const providersStr = localStorage.getItem(PROVIDERS_KEY);
    if (!providersStr) {
      return [];
    }
    return JSON.parse(providersStr);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    return [];
  }
};

/**
 * Obtiene un proveedor por ID
 */
export const getProviderById = async (id: number): Promise<Provider | null> => {
  try {
    const providers = await getAllProviders();
    return providers.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    return null;
  }
};

/**
 * Crea un nuevo proveedor
 */
export const createProvider = async (data: CreateProviderData): Promise<Provider> => {
  try {
    const providers = await getAllProviders();
    
    const newProvider: Provider = {
      id: Date.now(),
      ...data,
      activo: data.activo !== undefined ? data.activo : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const updatedProviders = [...providers, newProvider];
    localStorage.setItem(PROVIDERS_KEY, JSON.stringify(updatedProviders));
    
    return newProvider;
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
    const providers = await getAllProviders();
    const index = providers.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Proveedor no encontrado');
    }
    
    const updatedProvider: Provider = {
      ...providers[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    providers[index] = updatedProvider;
    localStorage.setItem(PROVIDERS_KEY, JSON.stringify(providers));
    
    return updatedProvider;
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
    const providers = await getAllProviders();
    const filteredProviders = providers.filter(p => p.id !== id);
    localStorage.setItem(PROVIDERS_KEY, JSON.stringify(filteredProviders));
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    throw error;
  }
};

/**
 * Obtiene proveedores activos
 */
export const getActiveProviders = async (): Promise<Provider[]> => {
  try {
    const providers = await getAllProviders();
    return providers.filter(p => p.activo);
  } catch (error) {
    console.error('Error al obtener proveedores activos:', error);
    return [];
  }
};
