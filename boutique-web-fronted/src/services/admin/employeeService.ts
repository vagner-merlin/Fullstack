import apiClient from '../apiClient';/**/**



export interface Group { * Servicio de Gestión de Grupos y Empleados * Servicio de Gestión de Grupos y Empleados

  id: number;

  name: string; * Conectado con API Backend Django * Conectado con API Backend Django

  users_count?: number;

  permissions_count?: number; */ */

}



export interface Employee {

  id: number;import apiClient from '../apiClient';import apiClient from '../apiClient';

  username: string;

  email: string;

  first_name: string;

  last_name: string;// ==================== INTERFACES ====================// ==================== INTERFACES ====================

  is_active: boolean;

  is_staff: boolean;

  date_joined: string;

  last_login: string | null;export interface Group {export interface Group {

  groups: Group[];

  group_names: string[];  id: number;  id: number;

}

  name: string;  name: string;

interface GroupsListResponse {

  success: boolean;  users_count?: number;  users_count?: number;

  count: number;

  groups: Group[];  permissions_count?: number;  permissions_count?: number;

}

}}

interface GroupResponse {

  success: boolean;

  message: string;

  group: Group;export interface Employee {export interface Employee {

}

  id: number;  id: number;

interface EmployeesListResponse {

  success: boolean;  username: string;  username: string;

  count: number;

  employees: Employee[];  email: string;  email: string;

}

  first_name: string;  first_name: string;

interface EmployeeResponse {

  success: boolean;  last_name: string;  last_name: string;

  message: string;

  employee: Employee;  is_active: boolean;  is_active: boolean;

}

  is_staff: boolean;  is_staff: boolean;

export const getAllGroups = async (): Promise<Group[]> => {

  try {  date_joined: string;  date_joined: string;

    const response = await apiClient.get<GroupsListResponse>('/users/groups/');

    return response.data.groups || [];  last_login: string | null;  last_login: string | null;

  } catch (error) {

    console.error('Error al obtener grupos:', error);  groups: Group[];  groups: Group[];

    throw error;

  }  group_names: string[];  group_names: string[];

};

}}

export const createGroup = async (name: string): Promise<Group> => {

  try {

    const response = await apiClient.post<GroupResponse>('/users/groups/', { name });

    return response.data.group;// Respuestas de la API// Respuestas de la API

  } catch (error) {

    console.error('Error al crear grupo:', error);interface GroupsListResponse {interface GroupsListResponse {

    throw error;

  }  success: boolean;  success: boolean;

};

  count: number;  count: number;

export const deleteGroup = async (id: number): Promise<void> => {

  try {  groups: Group[];  groups: Group[];

    await apiClient.delete(`/users/groups/${id}/`);

  } catch (error) {}}

    console.error('Error al eliminar grupo:', error);

    throw error;

  }

};interface GroupResponse {interface GroupResponse {



export const getAllEmployees = async (): Promise<Employee[]> => {  success: boolean;  success: boolean;

  try {

    const response = await apiClient.get<EmployeesListResponse>('/users/employees/');  message: string;  message: string;

    return response.data.employees || [];

  } catch (error) {  group: Group;  group: Group;

    console.error('Error al obtener empleados:', error);

    throw error;}}

  }

};



export const createEmployee = async (data: {interface EmployeesListResponse {interface EmployeesListResponse {

  username: string;

  email: string;  success: boolean;  success: boolean;

  password: string;

  first_name?: string;  count: number;  count: number;

  last_name?: string;

  group_id: number;  employees: Employee[];  employees: Employee[];

  is_staff?: boolean;

}): Promise<Employee> => {}}

  try {

    const response = await apiClient.post<EmployeeResponse>('/users/employees/create/', data);

    return response.data.employee;

  } catch (error) {interface EmployeeResponse {interface EmployeeResponse {

    console.error('Error al crear empleado:', error);

    throw error;  success: boolean;  success: boolean;

  }

};  message: string;  message: string;



export const toggleEmployeeActive = async (userId: number): Promise<Employee> => {  employee: Employee;  employee: Employee;

  try {

    const response = await apiClient.patch<EmployeeResponse>(}}

      `/users/employees/${userId}/toggle-active/`

    );

    return response.data.employee;

  } catch (error) {// ==================== API DE GRUPOS ====================// ==================== API DE GRUPOS ====================

    console.error('Error al cambiar estado del empleado:', error);

    throw error;

  }

};/**/**



export const deleteEmployee = async (userId: number): Promise<void> => { * Listar todos los grupos * Listar todos los grupos

  try {

    await apiClient.delete(`/users/employees/${userId}/delete/`); */ */

  } catch (error) {

    console.error('Error al eliminar empleado:', error);export const getAllGroups = async (): Promise<Group[]> => {export const getAllGroups = async (): Promise<Group[]> => {

    throw error;

  }  try {  try {

};

    const response = await apiClient.get<GroupsListResponse>('/users/groups/');    const response = await apiClient.get<GroupsListResponse>('/users/groups/');

export const addUserToGroup = async (userId: number, groupId: number): Promise<void> => {

  try {    return response.data.groups || [];    return response.data.groups || [];

    await apiClient.post('/users/add-user-to-group/', {

      user_id: userId,  } catch (error) {  } catch (error) {

      group_id: groupId

    });    console.error('Error al obtener grupos:', error);    console.error('Error al obtener grupos:', error);

  } catch (error) {

    console.error('Error al agregar usuario al grupo:', error);    throw error;    throw error;

    throw error;

  }  }  }

};

};};

export const removeUserFromGroup = async (userId: number, groupId: number): Promise<void> => {

  try {

    await apiClient.post('/users/remove-user-from-group/', {

      user_id: userId,/**/**

      group_id: groupId

    }); * Crear un nuevo grupo * Crear un nuevo grupo

  } catch (error) {

    console.error('Error al remover usuario del grupo:', error); */ */

    throw error;

  }export const createGroup = async (name: string): Promise<Group> => {export const createGroup = async (name: string): Promise<Group> => {

};

  try {  try {

export const searchEmployees = async (searchTerm: string): Promise<Employee[]> => {

  try {    const response = await apiClient.post<GroupResponse>('/users/groups/', { name });    const response = await apiClient.post<GroupResponse>('/users/groups/', { name });

    const employees = await getAllEmployees();

    if (!searchTerm.trim()) {    return response.data.group;    return response.data.group;

      return employees;

    }  } catch (error) {  } catch (error) {

    

    const term = searchTerm.toLowerCase();    console.error('Error al crear grupo:', error);    console.error('Error al crear grupo:', error);

    return employees.filter(

      emp =>     throw error;    throw error;

        emp.username.toLowerCase().includes(term) ||

        emp.email.toLowerCase().includes(term) ||  }  }

        emp.first_name.toLowerCase().includes(term) ||

        emp.last_name.toLowerCase().includes(term) ||};};

        emp.group_names.some(g => g.toLowerCase().includes(term))

    );

  } catch (error) {

    console.error('Error al buscar empleados:', error);/**/**

    return [];

  } * Eliminar un grupo * Eliminar un grupo

};

 */ */

export const deleteGroup = async (id: number): Promise<void> => {export const deleteGroup = async (id: number): Promise<void> => {

  try {  try {

    await apiClient.delete(`/users/groups/${id}/`);    await apiClient.delete(`/users/groups/${id}/`);

  } catch (error) {  } catch (error) {

    console.error('Error al eliminar grupo:', error);    console.error('Error al eliminar grupo:', error);

    throw error;    throw error;

  }  }

};};



// ==================== API DE EMPLEADOS ====================// ==================== API DE EMPLEADOS ====================



/**/**

 * Listar todos los empleados (excluye clientes y superusers) * Listar todos los empleados (excluye clientes y superusers)

 */ */

export const getAllEmployees = async (): Promise<Employee[]> => {export const getAllEmployees = async (): Promise<Employee[]> => {

  try {  try {

    const response = await apiClient.get<EmployeesListResponse>('/users/employees/');    const response = await apiClient.get<EmployeesListResponse>('/users/employees/');

    return response.data.employees || [];    return response.data.employees || [];

  } catch (error) {  } catch (error) {

    console.error('Error al obtener empleados:', error);    console.error('Error al obtener empleados:', error);

    throw error;    throw error;

  }  }

};};



/**/**

 * Crear un nuevo empleado * Crear un nuevo empleado

 */ */

export const createEmployee = async (data: {export const createEmployee = async (data: {

  username: string;  username: string;

  email: string;  email: string;

  password: string;  password: string;

  first_name?: string;  first_name?: string;

  last_name?: string;  last_name?: string;

  group_id: number;  group_id: number;

  is_staff?: boolean;  is_staff?: boolean;

}): Promise<Employee> => {}): Promise<Employee> => {

  try {  try {

    const response = await apiClient.post<EmployeeResponse>('/users/employees/create/', data);    const response = await apiClient.post<EmployeeResponse>('/users/employees/create/', data);

    return response.data.employee;    return response.data.employee;

  } catch (error) {  } catch (error) {

    console.error('Error al crear empleado:', error);    console.error('Error al crear empleado:', error);

    throw error;    throw error;

  }  }

};};



/**/**

 * Activar/Desactivar un empleado * Activar/Desactivar un empleado

 */ */

export const toggleEmployeeActive = async (userId: number): Promise<Employee> => {export const toggleEmployeeActive = async (userId: number): Promise<Employee> => {

  try {  try {

    const response = await apiClient.patch<EmployeeResponse>(    const response = await apiClient.patch<EmployeeResponse>(

      `/users/employees/${userId}/toggle-active/`      `/users/employees/${userId}/toggle-active/`

    );    );

    return response.data.employee;    return response.data.employee;

  } catch (error) {  } catch (error) {

    console.error('Error al cambiar estado del empleado:', error);    console.error('Error al cambiar estado del empleado:', error);

    throw error;    throw error;

  }  }

};};



/**/**

 * Eliminar un empleado * Eliminar un empleado

 */ */

export const deleteEmployee = async (userId: number): Promise<void> => {export const deleteEmployee = async (userId: number): Promise<void> => {

  try {  try {

    await apiClient.delete(`/users/employees/${userId}/delete/`);    await apiClient.delete(`/users/employees/${userId}/delete/`);

  } catch (error) {  } catch (error) {

    console.error('Error al eliminar empleado:', error);    console.error('Error al eliminar empleado:', error);

    throw error;    throw error;

  }  }

};};



// ==================== API DE RELACIÓN USUARIO-GRUPO ====================// ==================== API DE RELACIÓN USUARIO-GRUPO ====================



/**/**

 * Agregar usuario a un grupo * Agregar usuario a un grupo

 */ */

export const addUserToGroup = async (userId: number, groupId: number): Promise<void> => {export const addUserToGroup = async (userId: number, groupId: number): Promise<void> => {

  try {  try {

    await apiClient.post('/users/add-user-to-group/', {    await apiClient.post('/users/add-user-to-group/', {

      user_id: userId,      user_id: userId,

      group_id: groupId      group_id: groupId

    });    });

  } catch (error) {  } catch (error) {

    console.error('Error al agregar usuario al grupo:', error);    console.error('Error al agregar usuario al grupo:', error);

    throw error;    throw error;

  }  }

};};



/**/**

 * Remover usuario de un grupo * Remover usuario de un grupo

 */ */

export const removeUserFromGroup = async (userId: number, groupId: number): Promise<void> => {export const removeUserFromGroup = async (userId: number, groupId: number): Promise<void> => {

  try {  try {

    await apiClient.post('/users/remove-user-from-group/', {    await apiClient.post('/users/remove-user-from-group/', {

      user_id: userId,      user_id: userId,

      group_id: groupId      group_id: groupId

    });    });

  } catch (error) {  } catch (error) {

    console.error('Error al remover usuario del grupo:', error);    console.error('Error al remover usuario del grupo:', error);

    throw error;    throw error;

  }  }

};};



/**/**

 * Buscar empleados por término * Buscar empleados por término

 */ */

export const searchEmployees = async (searchTerm: string): Promise<Employee[]> => {export const searchEmployees = async (searchTerm: string): Promise<Employee[]> => {

  try {  try {

    const employees = await getAllEmployees();    const employees = await getAllEmployees();

    if (!searchTerm.trim()) {    if (!searchTerm.trim()) {

      return employees;      return employees;

    }    }

        

    const term = searchTerm.toLowerCase();    const term = searchTerm.toLowerCase();

    return employees.filter(    return employees.filter(

      emp =>       emp => 

        emp.username.toLowerCase().includes(term) ||        emp.username.toLowerCase().includes(term) ||

        emp.email.toLowerCase().includes(term) ||        emp.email.toLowerCase().includes(term) ||

        emp.first_name.toLowerCase().includes(term) ||        emp.first_name.toLowerCase().includes(term) ||

        emp.last_name.toLowerCase().includes(term) ||        emp.last_name.toLowerCase().includes(term) ||

        emp.group_names.some(g => g.toLowerCase().includes(term))        emp.group_names.some(g => g.toLowerCase().includes(term))

    );    );

  } catch (error) {  } catch (error) {

    console.error('Error al buscar empleados:', error);    console.error('Error al buscar empleados:', error);

    return [];    return [];

  }  }

};};

};

/**
 * Obtiene un empleado por ID
 */
export const getEmployeeById = async (id: number): Promise<Employee | null> => {
  try {
    const employees = await getAllEmployees();
    return employees.find(e => e.id === id) || null;
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    return null;
  }
};

/**
 * Crea un nuevo empleado
 */
export const createEmployee = async (data: CreateEmployeeData): Promise<Employee> => {
  try {
    const employees = await getAllEmployees();
    
    const newEmployee: Employee = {
      id: Date.now(),
      ...data,
      activo: data.activo !== undefined ? data.activo : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const updatedEmployees = [...employees, newEmployee];
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updatedEmployees));
    
    return newEmployee;
  } catch (error) {
    console.error('Error al crear empleado:', error);
    throw error;
  }
};

/**
 * Actualiza un empleado
 */
export const updateEmployee = async (
  id: number,
  data: Partial<CreateEmployeeData>
): Promise<Employee> => {
  try {
    const employees = await getAllEmployees();
    const index = employees.findIndex(e => e.id === id);
    
    if (index === -1) {
      throw new Error('Empleado no encontrado');
    }
    
    const updatedEmployee: Employee = {
      ...employees[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    employees[index] = updatedEmployee;
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
    
    return updatedEmployee;
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    throw error;
  }
};

/**
 * Elimina un empleado
 */
export const deleteEmployee = async (id: number): Promise<void> => {
  try {
    const employees = await getAllEmployees();
    const filteredEmployees = employees.filter(e => e.id !== id);
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(filteredEmployees));
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    throw error;
  }
};

/**
 * Obtiene empleados activos
 */
export const getActiveEmployees = async (): Promise<Employee[]> => {
  try {
    const employees = await getAllEmployees();
    return employees.filter(e => e.activo);
  } catch (error) {
    console.error('Error al obtener empleados activos:', error);
    return [];
  }
};

/**
 * Obtiene empleados por cargo
 */
export const getEmployeesByRole = async (
  cargo: 'vendedor' | 'admin' | 'gerente'
): Promise<Employee[]> => {
  try {
    const employees = await getAllEmployees();
    return employees.filter(e => e.cargo === cargo && e.activo);
  } catch (error) {
    console.error('Error al obtener empleados por cargo:', error);
    return [];
  }
};
