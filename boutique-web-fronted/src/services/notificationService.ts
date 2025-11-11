/**
 * Servicio de Notificaciones
 * Gestiona las notificaciones del usuario con persistencia en localStorage
 */

export type NotificationType = 'order' | 'payment' | 'shipping' | 'favorite' | 'admin' | 'info';

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string; // URL opcional para redirigir al hacer clic
  metadata?: Record<string, unknown>; // Datos adicionales
}

const NOTIFICATIONS_KEY = 'boutique_notifications';

/**
 * Obtiene todas las notificaciones del usuario actual
 */
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return [];
    }
    
    const user = JSON.parse(userStr);
    const notificationsStr = localStorage.getItem(`${NOTIFICATIONS_KEY}_${user.id}`);
    
    if (!notificationsStr) {
      return [];
    }
    
    const notifications: Notification[] = JSON.parse(notificationsStr);
    
    // Ordenar por fecha (más recientes primero)
    return notifications.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return [];
  }
};

/**
 * Obtiene solo las notificaciones no leídas
 */
export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const notifications = await getNotifications();
  return notifications.filter(n => !n.read);
};

/**
 * Cuenta las notificaciones no leídas
 */
export const getUnreadCount = async (): Promise<number> => {
  const unread = await getUnreadNotifications();
  return unread.length;
};

/**
 * Crea una nueva notificación
 */
export const createNotification = async (
  data: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'read'>
): Promise<Notification> => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Usuario no autenticado');
    }
    
    const user = JSON.parse(userStr);
    const notifications = await getNotifications();
    
    const newNotification: Notification = {
      id: Date.now(),
      user_id: user.id,
      read: false,
      created_at: new Date().toISOString(),
      ...data,
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    
    // Limitar a las últimas 100 notificaciones
    const limitedNotifications = updatedNotifications.slice(0, 100);
    
    localStorage.setItem(
      `${NOTIFICATIONS_KEY}_${user.id}`,
      JSON.stringify(limitedNotifications)
    );
    
    return newNotification;
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  }
};

/**
 * Marca una notificación como leída
 */
export const markAsRead = async (notificationId: number): Promise<void> => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return;
    }
    
    const user = JSON.parse(userStr);
    const notifications = await getNotifications();
    
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    localStorage.setItem(
      `${NOTIFICATIONS_KEY}_${user.id}`,
      JSON.stringify(updatedNotifications)
    );
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    throw error;
  }
};

/**
 * Marca todas las notificaciones como leídas
 */
export const markAllAsRead = async (): Promise<void> => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return;
    }
    
    const user = JSON.parse(userStr);
    const notifications = await getNotifications();
    
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    
    localStorage.setItem(
      `${NOTIFICATIONS_KEY}_${user.id}`,
      JSON.stringify(updatedNotifications)
    );
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
    throw error;
  }
};

/**
 * Elimina una notificación
 */
export const deleteNotification = async (notificationId: number): Promise<void> => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return;
    }
    
    const user = JSON.parse(userStr);
    const notifications = await getNotifications();
    
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    
    localStorage.setItem(
      `${NOTIFICATIONS_KEY}_${user.id}`,
      JSON.stringify(updatedNotifications)
    );
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    throw error;
  }
};

/**
 * Elimina todas las notificaciones leídas
 */
export const deleteAllRead = async (): Promise<void> => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return;
    }
    
    const user = JSON.parse(userStr);
    const notifications = await getNotifications();
    
    const updatedNotifications = notifications.filter(n => !n.read);
    
    localStorage.setItem(
      `${NOTIFICATIONS_KEY}_${user.id}`,
      JSON.stringify(updatedNotifications)
    );
  } catch (error) {
    console.error('Error al eliminar notificaciones leídas:', error);
    throw error;
  }
};
