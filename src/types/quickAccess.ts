import { FeatureActionType } from "./context-types";

export interface QuickAccessConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  enabled: boolean;
  action: {
    type: FeatureActionType; // "modal" | "redirect"
    target: string;
  };
}


// export type QuickAccessIconKey = "globe" | "gift" | "user";
// export interface QuickAccessCard {
//   id: string;
//   title: string;
//   description: string;
//   icon: QuickAccessIconKey;
//   redirectUrl: string;
// }

// export interface QuickAccessConfig {
//   cardBgColor: string;
//   cards: QuickAccessCard[];
// }
