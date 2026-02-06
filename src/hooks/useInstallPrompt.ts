import { useEffect, useState } from "react";

let deferredPrompt: any = null;

export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt = e;
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
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
