export type PublicNotification = {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  link?: string;
  is_active: boolean;
};
