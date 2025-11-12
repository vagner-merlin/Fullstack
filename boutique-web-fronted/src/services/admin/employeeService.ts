import apiClient from '../apiClient';

/**
 * Servicio de Gestión de Grupos y Empleados
 * Conectado con API Backend Django
 */

// ==================== INTERFACES ====================

export interface Group {
  id: number;
  name: string;
  users_count?: number;
  permissions_count?: number;
}

export interface Employee {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string | null;
  groups: Group[];
  group_names: string[];
}

interface GroupsListResponse {
  success: boolean;
  count: number;
  groups: Group[];
}

interface GroupResponse {
  success: boolean;
  message: string;
  group: Group;
}

interface EmployeesListResponse {
  success: boolean;
  count: number;
  employees: Employee[];
}

interface EmployeeResponse {
  success: boolean;
  message: string;
  employee: Employee;
}

export interface CreateEmployeeData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  group_id: number;
  is_staff?: boolean;
}

// ==================== API DE GRUPOS ====================

/**
 * Listar todos los grupos
 */
export const getAllGroups = async (): Promise<Group[]> => {
  try {
    const response = await apiClient.get<GroupsListResponse>('/users/groups/');
    return response.data.groups || [];
  } catch (error) {
    console.error('Error al obtener grupos:', error);
    throw error;
  }
};

/**
 * Crear un nuevo grupo
 */
export const createGroup = async (name: string): Promise<Group> => {
  try {
    const response = await apiClient.post<GroupResponse>('/users/groups/', { name });
    return response.data.group;
  } catch (error) {
    console.error('Error al crear grupo:', error);
    throw error;
  }
};

/**
 * Eliminar un grupo
 */
export const deleteGroup = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/users/groups/${id}/`);
  } catch (error) {
    console.error('Error al eliminar grupo:', error);
    throw error;
  }
};

// ==================== API DE EMPLEADOS ====================

/**
 * Listar todos los empleados
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await apiClient.get<EmployeesListResponse>('/users/employees/');
    return response.data.employees || [];
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    throw error;
  }
};

/**
 * Crear un nuevo empleado
 */
export const createEmployee = async (data: CreateEmployeeData): Promise<Employee> => {
  try {
    const response = await apiClient.post<EmployeeResponse>('/users/employees/create/', data);
    return response.data.employee;
  } catch (error) {
    console.error('Error al crear empleado:', error);
    throw error;
  }
};

/**
 * Activar/desactivar empleado
 */
export const toggleEmployeeActive = async (userId: number): Promise<Employee> => {
  try {
    const response = await apiClient.patch<EmployeeResponse>(
      `/users/employees/${userId}/toggle-active/`
    );
    return response.data.employee;
  } catch (error) {
    console.error('Error al cambiar estado del empleado:', error);
    throw error;
  }
};

/**
 * Eliminar empleado
 */
export const deleteEmployee = async (userId: number): Promise<void> => {
  try {
    await apiClient.delete(`/users/employees/${userId}/delete/`);
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    throw error;
  }
};