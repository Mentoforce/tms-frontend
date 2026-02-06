// hooks/useInstallPrompt.ts
import { useEffect, useState } from "react";
import { BeforeInstallPromptEvent } from "../../global";

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onBeforeInstall = (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      deferredPrompt = promptEvent;
      setCanInstall(true);
    };

    const onInstalled = () => {
      deferredPrompt = null;
      setCanInstall(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    deferredPrompt = null;
    setCanInstall(false);
  };

  return { canInstall, install };
}
