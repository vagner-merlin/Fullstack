// Service para usuarios - Conectado al backend Django

import type { User } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: 'M' | 'F' | 'Otro';
}

export const getMe = async (): Promise<User> => {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    throw new Error('Usuario no autenticado');
  }

  const user = JSON.parse(userStr);
  
  const response = await fetch(`${API_URL}/api/users/users/${user.id}/`, {
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener datos del usuario');
  }

  return response.json();
};

export const updateUser = async (userId: number, data: UpdateUserData): Promise<User> => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('Usuario no autenticado');
  }

  const response = await fetch(`${API_URL}/api/users/users/${userId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar usuario');
  }

  return response.json();
};

export const updateClientProfile = async (clientId: number, data: UpdateUserData): Promise<any> => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('Usuario no autenticado');
  }

  const response = await fetch(`${API_URL}/api/clientes/clientes/${clientId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      telefono: data.telefono,
      fecha_nacimiento: data.fecha_nacimiento,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar perfil');
  }

  return response.json();
};

const userService = {
  getMe,
  updateUser,
  updateClientProfile,
};

export default userService;
