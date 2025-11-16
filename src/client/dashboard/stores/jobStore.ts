import { create } from "zustand";

interface JobStore {
    selectedJobId: string | null;
    setSelectedJobId: (id: string | null) => void;
    statusFilter: "all" | "active" | "paused";
    setStatusFilter: (filter: "all" | "active" | "paused") => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const useJobStore = create<JobStore>((set) => ({
    selectedJobId: null,
    setSelectedJobId: (id) => set({ selectedJobId: id }),
    statusFilter: "all",
    setStatusFilter: (filter) => set({ statusFilter: filter }),
    searchQuery: "",
    setSearchQuery: (query) => set({ searchQuery: query }),
}));
