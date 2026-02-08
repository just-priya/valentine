import { useState, useEffect, useCallback } from "react";
import { config as defaultConfig } from "./config";

const STORAGE_KEY = "valentine-config";

export function useConfig() {
  const [config, setConfig] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultConfig, ...JSON.parse(stored) };
      }
    } catch (_) {}
    return defaultConfig;
  });

  const saveConfig = useCallback((updates) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        if (e?.name === "QuotaExceededError") {
          throw new Error("STORAGE_FULL");
        }
      }
      return next;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }, []);

  return { config, saveConfig, resetConfig };
}
