import { motion } from 'framer-motion';
import { Bell, Check, Trash2, ArrowLeft, Package, Heart, CreditCard, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import type { NotificationType } from '../../services/notificationService';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'order':
      return <Package className="w-5 h-5 text-blue-500" />;
    case 'payment':
      return <CreditCard className="w-5 h-5 text-green-500" />;
    case 'shipping':
      return <Package className="w-5 h-5 text-purple-500" />;
    case 'favorite':
      return <Heart className="w-5 h-5 text-boutique-rose" />;
    case 'admin':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Info className="w-5 h-5 text-gray-500" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'order':
      return 'bg-blue-50 border-blue-200';
    case 'payment':
      return 'bg-green-50 border-green-200';
    case 'shipping':
      return 'bg-purple-50 border-purple-200';
    case 'favorite':
      return 'bg-pink-50 border-pink-200';
    case 'admin':
      return 'bg-red-50 border-red-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleNotificationClick = async (notificationId: number, link?: string) => {
    await markAsRead(notificationId);
    if (link) {
      navigate(link);
    }
  };

  const handleDelete = async (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Eliminar esta notificación?')) {
      await deleteNotification(notificationId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-boutique-beige py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-rose"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-boutique-beige py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-boutique-rose transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver</span>
          </button>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-boutique-rose" />
              <h1 className="text-3xl font-bold text-boutique-black font-raleway">
                Notificaciones
              </h1>
            </div>

            {unreadNotifications.length > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-2 px-4 py-2 bg-boutique-rose text-white rounded-lg hover:bg-boutique-rose/90 transition-colors text-sm font-medium"
              >
                <Check className="w-4 h-4" />
                Marcar todas como leídas
              </button>
            )}
          </div>

          {notifications.length > 0 && (
            <p className="text-gray-600">
              {unreadNotifications.length > 0 ? (
                <>
                  <span className="font-semibold text-boutique-rose">
                    {unreadNotifications.length}
                  </span>{' '}
                  {unreadNotifications.length === 1 ? 'notificación nueva' : 'notificaciones nuevas'}
                </>
              ) : (
                'No tienes notificaciones nuevas'
              )}
            </p>
          )}
        </motion.div>

        {/* Lista de notificaciones */}
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-12 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-boutique-beige rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-boutique-rose" />
              </div>
              <h2 className="text-xl font-semibold text-boutique-black mb-2">
                No tienes notificaciones
              </h2>
              <p className="text-gray-600 mb-6">
                Cuando realices compras, añadas favoritos o recibas actualizaciones, aparecerán aquí
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-boutique-rose text-white rounded-lg hover:bg-boutique-rose/90 transition-colors font-medium"
              >
                Explorar productos
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNotificationClick(notification.id, notification.link)}
                className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                  notification.read
                    ? 'border-gray-200'
                    : `${getNotificationColor(notification.type)} border-l-4`
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icono */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${
                    notification.read ? 'bg-gray-100' : getNotificationColor(notification.type).split(' ')[0]
                  } flex items-center justify-center`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        notification.read ? 'text-gray-700' : 'text-boutique-black'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-boutique-rose rounded-full"></span>
                      )}
                    </div>

                    <p className={`text-sm mb-2 ${
                      notification.read ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatDate(notification.created_at)}
                      </span>

                      <button
                        onClick={(e) => handleDelete(notification.id, e)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
