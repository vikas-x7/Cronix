export interface Workspace {
  id: string;
  name: string;
  jobsCount: number;
  createdAt: string;
}

export interface CreateWorkspaceInput {
  name: string;
}
