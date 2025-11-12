import apiClient from '../apiClient';

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

export const getAllGroups = async (): Promise<Group[]> => {
  const response = await apiClient.get<GroupsListResponse>('/users/groups/');
  return response.data.groups || [];
};

export const createGroup = async (name: string): Promise<Group> => {
  const response = await apiClient.post<GroupResponse>('/users/groups/', { name });
  return response.data.group;
};

export const deleteGroup = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/groups/${id}/`);
};

export const getAllEmployees = async (): Promise<Employee[]> => {
  const response = await apiClient.get<EmployeesListResponse>('/users/employees/');
  return response.data.employees || [];
};

export const createEmployee = async (data: {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  group_id: number;
  is_staff?: boolean;
}): Promise<Employee> => {
  const response = await apiClient.post<EmployeeResponse>('/users/employees/create/', data);
  return response.data.employee;
};

export const toggleEmployeeActive = async (userId: number): Promise<Employee> => {
  const response = await apiClient.patch<EmployeeResponse>(
    `/users/employees/${userId}/toggle-active/`
  );
  return response.data.employee;
};

export const deleteEmployee = async (userId: number): Promise<void> => {
  await apiClient.delete(`/users/employees/${userId}/delete/`);
};

export const addUserToGroup = async (userId: number, groupId: number): Promise<void> => {
  await apiClient.post('/users/add-user-to-group/', {
    user_id: userId,
    group_id: groupId
  });
};

export const removeUserFromGroup = async (userId: number, groupId: number): Promise<void> => {
  await apiClient.post('/users/remove-user-from-group/', {
    user_id: userId,
    group_id: groupId
  });
};
