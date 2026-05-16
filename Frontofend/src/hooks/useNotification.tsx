import { create } from 'zustand';
import { ToastNotification, NotificationType } from '../types/api';

interface NotificationState {
  toast: ToastNotification | null;
  showToast: (message: string, type?: NotificationType) => void;
  clearToast: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toast: null,
  showToast: (message, type = 'error') => {
    const id = Math.random().toString(36).substring(2, 9);
    set({ toast: { id, message, type } });
    
    
    setTimeout(() => {
      set((state) => (state.toast?.id === id ? { toast: null } : {}));
    }, 4000);
  },
  clearToast: () => set({ toast: null }),
}));