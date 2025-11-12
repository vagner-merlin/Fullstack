import type { User, RegisterData } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  redirect_to?: string;
}

interface RegisterResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

interface LoginApiResponse {
  success: boolean;
  message: string;
  token: string;
  user_id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  groups: string[];
  user_type: string;
  redirect_to: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/api/users/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Credenciales inválidas');
    }
    
    const data: LoginApiResponse = await response.json();
    console.log('🔐 Respuesta de login:', data);
    
    // Determinar el rol basado en el user_type del backend
    let role: UserRole = 'client';
    
    switch (data.user_type) {
      case 'superuser':
        role = 'superadmin';
        break;
      case 'staff':
        role = 'seller';
        break;
      case 'client_cli':
      case 'client_com':
      case 'client':
        role = 'client';
        break;
      default:
        role = 'client';
    }
    
    const user: User = {
      id: data.user_id,
      email: data.email,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      role: role,
      is_superuser: data.is_superuser || false,
      is_staff: data.is_staff || false,
      is_active: true,
    };
    
    console.log('✅ Usuario autenticado:', user);
    console.log('🚀 Redirigir a:', data.redirect_to);
    
    return {
      access_token: data.token,
      refresh_token: data.token,
      user: user,
      redirect_to: data.redirect_to,
    };
  },

  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}/api/users/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }
    
    const responseData = await response.json();
    console.log('📝 Respuesta de registro:', responseData);
    
    // Crear objeto user para el registro
    const user: User = {
      id: responseData.user_id,
      email: responseData.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: 'client', // Los registros nuevos son siempre clientes
      is_superuser: false,
      is_staff: false,
      is_active: true,
    };
    
    return {
      access_token: responseData.token,
      refresh_token: responseData.token,
      user: user,
    };
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      await fetch(`${API_URL}/api/users/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
  },

  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    const response = await fetch(`${API_URL}/api/users/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Error al renovar token');
    }

    return response.json();
  },

  getUserProfile: async (): Promise<User> => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token available');
    }

    const response = await fetch(`${API_URL}/api/users/profile/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener perfil');
    }

    const userData = await response.json();
    
    // Determinar role basado en propiedades del usuario
    let role: UserRole = 'client';
    if (userData.is_superuser) role = 'superadmin';
    else if (userData.is_staff) role = 'seller';
    
    return {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      role: role,
      is_superuser: userData.is_superuser || false,
      is_staff: userData.is_staff || false,
      is_active: userData.is_active !== undefined ? userData.is_active : true,
      telefono: userData.telefono,
      fecha_nacimiento: userData.fecha_nacimiento,
      genero: userData.genero,
      created_at: userData.created_at,
      direccion: userData.direccion,
      ciudad: userData.ciudad,
    };
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token available');
    }

    const response = await fetch(`${API_URL}/api/users/profile/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar perfil');
    }

    return response.json();
  },
};