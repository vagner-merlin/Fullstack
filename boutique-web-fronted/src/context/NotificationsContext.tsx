import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Notification } from '../services/notificationService';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification as createNotificationService,
  deleteNotification as deleteNotificationService,
} from '../services/notificationService';
import { useAuth } from '../hooks/useAuth';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'read'>) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export { NotificationsContext };
export type { NotificationsContextType };

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [notifs, count] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const addNotification = async (
    notification: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'read'>
  ) => {
    try {
      await createNotificationService(notification);
      await loadNotifications();
    } catch (error) {
      console.error('Error al añadir notificación:', error);
      throw error;
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      throw error;
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      throw error;
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await deleteNotificationService(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      throw error;
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        addNotification,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        deleteNotification: handleDeleteNotification,
        refreshNotifications: loadNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
