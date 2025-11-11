/**
 * Tipos compartidos para usuarios en el sistema
 */

export interface UserBase {
  id: number;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role: 'cliente' | 'vendedor' | 'admin' | 'superadmin';
  active?: boolean;
  created_at?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
}

export interface OrderBase {
  id: number;
  numero_pedido: string;
  user_email: string;
  total: number;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  fecha_creacion: string;
  items: Array<{
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }>;
}
