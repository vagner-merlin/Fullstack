/**
 * Servicio de Gestión de Usuarios para Super Admin
 */

export type UserRole = 'cliente' | 'seller' | 'admin' | 'superadmin';

export interface SystemUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  phone?: string;
  address?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  address?: string;
}

export interface UpdateUserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  is_active?: boolean;
  phone?: string;
  address?: string;
}

const STORAGE_KEY = 'boutique_system_users';

/**
 * Inicializa usuarios del sistema si no existen
 */
export const initializeUsers = (): void => {
  const usersStr = localStorage.getItem(STORAGE_KEY);
  if (!usersStr) {
    const defaultUsers: SystemUser[] = [
      {
        id: 1,
        email: 'admin@boutique.com',
        first_name: 'Admin',
        last_name: 'Principal',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      },
      {
        id: 2,
        email: 'superadmin@boutique.com',
        first_name: 'Super',
        last_name: 'Admin',
        role: 'superadmin',
        is_active: true,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      },
      {
        id: 3,
        email: 'seller@boutique.com',
        first_name: 'Vendedor',
        last_name: 'Principal',
        role: 'seller',
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 4,
        email: 'vendedor@boutique.com',
        first_name: 'María',
        last_name: 'Vendedora',
        role: 'seller',
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 5,
        email: 'cliente@boutique.com',
        first_name: 'Cliente',
        last_name: 'Ejemplo',
        role: 'cliente',
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  }
};

/**
 * Obtiene todos los usuarios del sistema
 */
export const getAllUsers = (): SystemUser[] => {
  initializeUsers();
  try {
    const usersStr = localStorage.getItem(STORAGE_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    return [];
  }
};

/**
 * Guarda usuarios en localStorage
 */
const saveUsers = (users: SystemUser[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
  }
};

/**
 * Obtiene usuario por ID
 */
export const getUserById = (id: number): SystemUser | null => {
  const users = getAllUsers();
  return users.find(u => u.id === id) || null;
};

/**
 * Obtiene usuario por email
 */
export const getUserByEmail = (email: string): SystemUser | null => {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

/**
 * Crea un nuevo usuario
 */
export const createUser = (data: CreateUserData): SystemUser => {
  const users = getAllUsers();
  
  // Verificar si el email ya existe
  if (getUserByEmail(data.email)) {
    throw new Error('El email ya está registrado');
  }

  const newUser: SystemUser = {
    id: Date.now(),
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    role: data.role,
    is_active: true,
    created_at: new Date().toISOString(),
    phone: data.phone,
    address: data.address,
  };

  users.push(newUser);
  saveUsers(users);

  return newUser;
};

/**
 * Actualiza un usuario
 */
export const updateUser = (id: number, data: UpdateUserData): SystemUser => {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar email duplicado si se está cambiando
  if (data.email && data.email !== users[userIndex].email) {
    const existingUser = getUserByEmail(data.email);
    if (existingUser && existingUser.id !== id) {
      throw new Error('El email ya está registrado');
    }
  }

  users[userIndex] = {
    ...users[userIndex],
    ...data,
  };

  saveUsers(users);
  return users[userIndex];
};

/**
 * Cambia el rol de un usuario
 */
export const changeUserRole = (userId: number, newRole: UserRole): SystemUser => {
  return updateUser(userId, { role: newRole });
};

/**
 * Activa o desactiva un usuario
 */
export const toggleUserStatus = (userId: number): SystemUser => {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return updateUser(userId, { is_active: !user.is_active });
};

/**
 * Elimina un usuario (soft delete - desactiva)
 */
export const deleteUser = (userId: number): void => {
  updateUser(userId, { is_active: false });
};

/**
 * Elimina permanentemente un usuario
 */
export const permanentDeleteUser = (userId: number): void => {
  const users = getAllUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  saveUsers(filteredUsers);
};

/**
 * Obtiene usuarios por rol
 */
export const getUsersByRole = (role: UserRole): SystemUser[] => {
  const users = getAllUsers();
  return users.filter(u => u.role === role);
};

/**
 * Obtiene usuarios activos
 */
export const getActiveUsers = (): SystemUser[] => {
  const users = getAllUsers();
  return users.filter(u => u.is_active);
};

/**
 * Obtiene estadísticas de usuarios
 */
export const getUserStats = () => {
  const users = getAllUsers();
  
  return {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    by_role: {
      superadmin: users.filter(u => u.role === 'superadmin').length,
      admin: users.filter(u => u.role === 'admin').length,
      seller: users.filter(u => u.role === 'seller').length,
      cliente: users.filter(u => u.role === 'cliente').length,
    },
  };
};

/**
 * Actualiza el último login de un usuario
 */
export const updateLastLogin = (userId: number): void => {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    users[userIndex].last_login = new Date().toISOString();
    saveUsers(users);
  }
};
