import type { User, RegisterData } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface RegisterResponse {
  user: User;
  access_token: string;
  refresh_token: string;
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
    
    const data = await response.json();
    console.log('🔐 Respuesta de login:', data);
    
    // Obtener datos del usuario
    const userResponse = await fetch(`${API_URL}/api/users/users/${data.user_id}/`, {
      headers: { 
        'Authorization': `Token ${data.token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!userResponse.ok) {
      throw new Error('Error al obtener datos del usuario');
    }
    
    const userData = await userResponse.json();
    console.log('👤 Datos del usuario:', userData);
    
    // Intentar obtener los grupos del usuario
    let role: UserRole = 'client'; // Por defecto es cliente
    
    try {
      const groupsResponse = await fetch(`${API_URL}/api/users/user-groups/${data.user_id}/`, {
        headers: { 
          'Authorization': `Token ${data.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (groupsResponse.ok) {
        const groupsData = await groupsResponse.json();
        console.log('👥 Grupos del usuario:', groupsData);
        
        // Determinar rol basado en los grupos
        if (groupsData.groups && Array.isArray(groupsData.groups)) {
          const groupNames = groupsData.groups.map((g: any) => g.name?.toLowerCase());
          
          if (userData.is_superuser || groupNames.includes('superadmin')) {
            role = 'superadmin';
          } else if (userData.is_staff || groupNames.includes('admin') || groupNames.includes('administrador')) {
            role = 'admin';
          } else if (groupNames.includes('seller') || groupNames.includes('vendedor')) {
            role = 'seller';
          } else if (groupNames.includes('client') || groupNames.includes('cliente')) {
            role = 'client';
          }
          
          console.log('✅ Rol detectado:', role);
        }
      } else {
        console.warn('⚠️ No se pudieron obtener los grupos del usuario, usando rol por defecto');
        
        // Fallback a la lógica anterior si no hay endpoint de grupos
        if (userData.is_superuser) {
          role = 'superadmin';
        } else if (userData.is_staff) {
          role = 'admin';
        }
      }
    } catch (groupError) {
      console.error('❌ Error al obtener grupos:', groupError);
      
      // Fallback a la lógica anterior
      if (userData.is_superuser) {
        role = 'superadmin';
      } else if (userData.is_staff) {
        role = 'admin';
      }
    }
    
    const user: User = {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      role: role,
      is_superuser: userData.is_superuser || false,
      is_staff: userData.is_staff || false,
      is_active: userData.is_active !== undefined ? userData.is_active : true,
    };
    
    console.log('✅ Usuario autenticado:', user);
    
    return {
      access_token: data.token,
      refresh_token: data.token,
      user: user,
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
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat();
        throw new Error(errorMessages[0] as string || 'Error en el registro');
      }
      throw new Error(error.message || 'Error en el registro');
    }
    
    const responseData = await response.json();
    
    // Verificar si el usuario fue asignado al grupo correctamente
    console.log('📝 Respuesta del registro:', responseData);
    
    if (responseData.group_id === 3 && responseData.group_name === 'cliente') {
      console.log('✅ Usuario asignado correctamente al grupo "cliente" (ID: 3)');
    } else if (!responseData.group_id) {
      console.warn('⚠️ El usuario no fue asignado a ningún grupo automáticamente');
      console.log('🔄 Intentando asignar manualmente al grupo "cliente"...');
      
      // Intentar asignar manualmente al grupo 3
      try {
        const addGroupResponse = await fetch(`${API_URL}/api/users/add-user-to-group/`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Token ${responseData.token}`
          },
          body: JSON.stringify({
            user_id: responseData.user_id,
            group_id: 3
          }),
        });
        
        if (addGroupResponse.ok) {
          const groupData = await addGroupResponse.json();
          console.log('✅ Usuario asignado manualmente al grupo:', groupData);
        } else {
          console.error('❌ Error al asignar usuario al grupo manualmente');
        }
      } catch (groupError) {
        console.error('❌ Error en la llamada para asignar grupo:', groupError);
      }
    }
    
    const user: User = {
      id: responseData.user_id,
      email: responseData.email,
      first_name: responseData.first_name || '',
      last_name: responseData.last_name || '',
      role: 'client',
      is_superuser: false,
      is_staff: false,
      is_active: true,
    };
    
    return {
      user: user,
      access_token: responseData.token,
      refresh_token: responseData.token,
    };
  },

  me: async (token: string): Promise<User> => {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('No autenticado');
    
    const user = JSON.parse(userStr);
    
    const response = await fetch(`${API_URL}/api/users/users/${user.id}/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Token inválido');
    
    const userData = await response.json();
    
    let role: UserRole = 'client';
    if (userData.is_superuser) role = 'superadmin';
    else if (userData.is_staff) role = 'admin';
    
    return {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      role: role,
      is_superuser: userData.is_superuser || false,
      is_staff: userData.is_staff || false,
      is_active: userData.is_active !== undefined ? userData.is_active : true,
    };
  },

  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    return { access_token: refreshToken };
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      console.log('No hay token para cerrar sesión');
      return;
    }
    
    try {
      // Llamar a la API de logout del backend para eliminar el token
      const response = await fetch(`${API_URL}/api/users/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Logout exitoso:', data.message);
      } else {
        console.error('Error al hacer logout en el servidor');
      }
    } catch (error) {
      console.error('Error en logout:', error);
      // Continuar con la limpieza local aunque falle el servidor
    }
    
    // Limpiar el localStorage (esto siempre se ejecuta)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};
