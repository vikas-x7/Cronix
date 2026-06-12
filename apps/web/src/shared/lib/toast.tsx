'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { cn } from './utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const STYLES: Record<ToastType, string> = {
  success: 'bg-[#1B1B1B] border-[#2A2A2A] text-white',
  error: 'bg-[#1B1B1B] border-[#2A2A2A] text-white',
  info: 'bg-[#1B1B1B] border-[#2A2A2A] text-white',
};

const ICON_STYLES: Record<ToastType, string> = {
  success: 'bg-[#DF5BCC]/15 text-[#DF5BCC]',
  error: 'bg-red-500/15 text-red-400',
  info: 'bg-white/10 text-white/60',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        success: useCallback(
          (msg: string) => addToast(msg, 'success'),
          [addToast],
        ),
        error: useCallback((msg: string) => addToast(msg, 'error'), [addToast]),
        info: useCallback((msg: string) => addToast(msg, 'info'), [addToast]),
      }}
    >
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 rounded-[3px] border px-4 py-3 shadow-lg text-sm animate-in slide-in-from-right',
              STYLES[toast.type],
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                ICON_STYLES[toast.type],
              )}
            >
              {ICONS[toast.type]}
            </span>
            <p className="flex-1 pt-0.5">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white/80 cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
