// Constantes de la aplicación

// Roles del sistema
export const ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller',
  CLIENT: 'client',
  SUPERADMIN: 'superadmin',
} as const;

// Estados de pedido
export const ORDER_STATUS = {
  PENDING: 'pendiente',
  PROCESSING: 'en_proceso',
  SHIPPED: 'enviado',
  DELIVERED: 'entregado',
  CANCELLED: 'cancelado',
} as const;

// Métodos de pago
export const PAYMENT_METHODS = {
  CARD: 'tarjeta',
  TRANSFER: 'transferencia',
  CASH: 'efectivo',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];
