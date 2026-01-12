import { FeatureConfig } from "@/types/context-types";

export function handleFeatureAction(
  feature: FeatureConfig,
  openModal: (key: string) => void,
  router: any
) {
  if (feature.action.type === "modal") {
    openModal(feature.action.target);
  }

  if (feature.action.type === "redirect") {
    router.push(feature.action.target);
  }
}
