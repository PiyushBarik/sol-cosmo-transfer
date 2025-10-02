"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

type ToastTone = "ok" | "err";

interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  push: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({
  children,
}: ToastProviderProps): React.JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);

  const push = useCallback((message: string, tone: ToastTone = "ok") => {
    const id = `toast-${++toastCounter.current}`;
    const toast: Toast = { id, message, tone };

    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const contextValue: ToastContextValue = { push };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 space-y-2"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              min-w-80 max-w-md rounded-lg border px-4 py-3 shadow-lg transition-all duration-300
              ${
                toast.tone === "err"
                  ? "border-red-500/50 bg-red-950/90 text-red-100"
                  : "border-green-500/50 bg-green-950/90 text-green-100"
              }
            `}
          >
            <p className="text-sm">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
