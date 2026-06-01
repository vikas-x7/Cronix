export interface Workspace {
  id: string;
  name: string;
  jobsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceInput {
  name: string;
}
