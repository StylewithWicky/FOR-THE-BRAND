export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  ip_address: string;
  details: string;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  message: string;
  type: NotificationType;
}