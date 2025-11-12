import type { ShippingAddress } from './orderService';

// Simulación de delay para desarrollo
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Tipo para dirección guardada (extiende ShippingAddress con ID)
export interface SavedAddress extends ShippingAddress {
  id: number;
  es_principal?: boolean;
  etiqueta?: string; // 'Casa', 'Trabajo', 'Otro'
}

export interface CreateAddressData {
  nombre_completo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  codigo_postal?: string;
  referencias?: string;
  es_principal?: boolean;
  etiqueta?: string;
}

/**
 * Obtener todas las direcciones del usuario
 */
export const getAddresses = async (): Promise<SavedAddress[]> => {
  await delay(300);

  const addressesStr = localStorage.getItem('addresses');
  if (!addressesStr) {
    return [];
  }

  return JSON.parse(addressesStr);
};

/**
 * Obtener una dirección por ID
 */
export const getAddressById = async (id: number): Promise<SavedAddress | null> => {
  await delay(200);

  const addresses = await getAddresses();
  return addresses.find(addr => addr.id === id) || null;
};

/**
 * Crear una nueva dirección
 */
export const createAddress = async (data: CreateAddressData): Promise<SavedAddress> => {
  await delay(500);

  const addresses = await getAddresses();

  // Si es principal, quitar principal de las demás
  if (data.es_principal) {
    addresses.forEach(addr => {
      addr.es_principal = false;
    });
  }

  // Crear nueva dirección
  const newAddress: SavedAddress = {
    id: Date.now(),
    direccion_completa: data.direccion, // Mapear direccion a direccion_completa
    ...data,
  };

  // Si es la primera dirección, hacerla principal
  if (addresses.length === 0) {
    newAddress.es_principal = true;
  }

  addresses.push(newAddress);
  localStorage.setItem('addresses', JSON.stringify(addresses));

  return newAddress;
};

/**
 * Actualizar una dirección existente
 */
export const updateAddress = async (
  id: number,
  data: Partial<CreateAddressData>
): Promise<SavedAddress> => {
  await delay(500);

  const addresses = await getAddresses();
  const index = addresses.findIndex(addr => addr.id === id);

  if (index === -1) {
    throw new Error('Dirección no encontrada');
  }

  // Si se marca como principal, quitar principal de las demás
  if (data.es_principal) {
    addresses.forEach(addr => {
      addr.es_principal = false;
    });
  }

  // Actualizar dirección
  addresses[index] = {
    ...addresses[index],
    ...data,
  };

  localStorage.setItem('addresses', JSON.stringify(addresses));

  return addresses[index];
};

/**
 * Eliminar una dirección
 */
export const deleteAddress = async (id: number): Promise<void> => {
  await delay(300);

  const addresses = await getAddresses();
  const filteredAddresses = addresses.filter(addr => addr.id !== id);

  // Si se eliminó la dirección principal y quedan otras, hacer principal la primera
  const deletedWasPrincipal = addresses.find(addr => addr.id === id)?.es_principal;
  if (deletedWasPrincipal && filteredAddresses.length > 0) {
    filteredAddresses[0].es_principal = true;
  }

  localStorage.setItem('addresses', JSON.stringify(filteredAddresses));
};

/**
 * Marcar una dirección como principal
 */
export const setPrincipalAddress = async (id: number): Promise<void> => {
  await delay(300);

  const addresses = await getAddresses();

  // Quitar principal de todas
  addresses.forEach(addr => {
    addr.es_principal = addr.id === id;
  });

  localStorage.setItem('addresses', JSON.stringify(addresses));
};

const addressService = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setPrincipalAddress,
};

export default addressService;
