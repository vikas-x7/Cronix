import { create } from "zustand";

export interface Toast {
    id: string;
    type: "success" | "error" | "info";
    message: string;
}

interface UIStore {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
    isCreateModalOpen: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    toasts: [],
    addToast: (toast) =>
        set((state) => ({
            toasts: [
                ...state.toasts,
                { ...toast, id: Date.now().toString() + Math.random().toString(36).slice(2) },
            ],
        })),
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
    isCreateModalOpen: false,
    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),
}));
