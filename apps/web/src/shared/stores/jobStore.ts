import { create } from 'zustand';

interface JobState {
  statusFilter: 'all' | string;
  setStatusFilter: (f: string) => void;
  workspaceFilter: string;
  setWorkspaceFilter: (f: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useJobStore = create<JobState>((set) => ({
  statusFilter: 'all',
  setStatusFilter: (f) => set({ statusFilter: f }),
  workspaceFilter: 'all',
  setWorkspaceFilter: (f) => set({ workspaceFilter: f }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
