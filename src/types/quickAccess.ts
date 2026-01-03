export type QuickAccessIconKey = "globe" | "gift" | "user";
export interface QuickAccessCard {
  id: string;
  title: string;
  description: string;
  icon: QuickAccessIconKey;
  redirectUrl: string;
}

export interface QuickAccessConfig {
  cardBgColor: string;
  cards: QuickAccessCard[];
}
