import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

// Configuración por defecto para los toasts
const defaultToastConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
};

// Funciones helper para mostrar toasts
export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      ...defaultToastConfig,
      ...options,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      ...defaultToastConfig,
      ...options,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      ...defaultToastConfig,
      ...options,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      ...defaultToastConfig,
      ...options,
    });
  },
};
