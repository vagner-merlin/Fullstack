/**
 * Servicio de Gestión de Empleados/Vendedores
 */

export interface Employee {
  id: number;
  user_id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cargo: 'vendedor' | 'admin' | 'gerente';
  salario?: number;
  fecha_contratacion: string;
  activo: boolean;
  direccion?: string;
  ciudad?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cargo: 'vendedor' | 'admin' | 'gerente';
  salario?: number;
  fecha_contratacion: string;
  activo?: boolean;
  direccion?: string;
  ciudad?: string;
}

const EMPLOYEES_KEY = 'boutique_employees';

/**
 * Obtiene todos los empleados
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const employeesStr = localStorage.getItem(EMPLOYEES_KEY);
    if (!employeesStr) {
      return [];
    }
    return JSON.parse(employeesStr);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    return [];
  }
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
