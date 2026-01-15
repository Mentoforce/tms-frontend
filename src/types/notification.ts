export type NotificationType = "info" | "success" | "warning" | "error";

export type NotificationItem = {
  _id?: string;
  title: string;
  message: string;
  type: NotificationType;
  is_active: boolean;
  start_date: string;
  end_date: string;
  createdAt?: string;
};
