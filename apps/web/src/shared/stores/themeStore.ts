import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('cronix-theme') as Theme | null;
  if (stored) return stored;
  return 'dark';
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('cronix-theme', next);
      return { theme: next };
    }),
  setTheme: (t) => {
    localStorage.setItem('cronix-theme', t);
    set({ theme: t });
  },
}));
