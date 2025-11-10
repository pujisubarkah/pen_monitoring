// src/lib/stores/toastStore.ts
import { writable } from 'svelte/store';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  return {
    subscribe,
    add: (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = {
        id,
        duration: 5000,
        ...toast
      };

      update(toasts => [...toasts, newToast]);

      // Auto remove after duration
      setTimeout(() => {
        update(toasts => toasts.filter(t => t.id !== id));
      }, newToast.duration);
    },
    remove: (id: string) => {
      update(toasts => toasts.filter(t => t.id !== id));
    },
    success: (message: string, duration?: number) => {
      return createToastStore().add({ message, type: 'success', duration });
    },
    error: (message: string, duration?: number) => {
      return createToastStore().add({ message, type: 'error', duration });
    },
    info: (message: string, duration?: number) => {
      return createToastStore().add({ message, type: 'info', duration });
    },
    warning: (message: string, duration?: number) => {
      return createToastStore().add({ message, type: 'warning', duration });
    }
  };
}

export const toastStore = createToastStore();