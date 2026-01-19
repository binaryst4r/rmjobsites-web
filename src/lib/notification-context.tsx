import { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number; // milliseconds, default 5000
}

interface NotificationContextType {
  notifications: Notification[];
  showSuccess: (message: string, title?: string, duration?: number) => void;
  showError: (message: string, title?: string, duration?: number) => void;
  showInfo: (message: string, title?: string, duration?: number) => void;
  dismissNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: NotificationType,
    message: string,
    title?: string,
    duration: number = 5000
  ) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const notification: Notification = {
      id,
      type,
      message,
      title,
      duration,
    };

    setNotifications((prev) => [...prev, notification]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, title?: string, duration?: number) => {
    addNotification('success', message, title, duration);
  }, [addNotification]);

  const showError = useCallback((message: string, title?: string, duration?: number) => {
    addNotification('error', message, title, duration);
  }, [addNotification]);

  const showInfo = useCallback((message: string, title?: string, duration?: number) => {
    addNotification('info', message, title, duration);
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showSuccess,
        showError,
        showInfo,
        dismissNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
