import { create } from 'zustand';

interface JobState {
  statusFilter: 'all' | string;
  setStatusFilter: (f: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useJobStore = create<JobState>((set) => ({
  statusFilter: 'all',
  setStatusFilter: (f) => set({ statusFilter: f }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
