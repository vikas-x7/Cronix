'use client';

import { useState } from 'react';
import {
  useWorkspaces,
  useCreateWorkspace,
  useDeleteWorkspace,
  WorkspaceCard,
  CreateWorkspaceModal,
} from '@/modules/workspaces';
import PageHeader from '@/shared/layout/page-header';
import type { CreateWorkspaceFormData } from '@/modules/workspaces/schemas/workspace.schema';

export default function WorkspacesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { data: workspaces, isLoading, isError, refetch } = useWorkspaces();
  const createMutation = useCreateWorkspace();
  const deleteMutation = useDeleteWorkspace();

  const handleCreate = (data: CreateWorkspaceFormData) => {
    createMutation.mutate(data, { onSuccess: () => setModalOpen(false) });
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Workspaces">
          <div className="h-9 w-32 animate-pulse rounded-lg bg-gray-100" />
        </PageHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <PageHeader title="Workspaces" />
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
          <p className="text-sm text-gray-500">Failed to load workspaces</p>
          <button
            onClick={() => refetch()}
            className="mt-3 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Workspaces">
        <button
          onClick={() => setModalOpen(true)}
          className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          New Workspace
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workspaces?.map((ws) => (
          <WorkspaceCard
            key={ws.id}
            workspace={ws}
            onDelete={(id) => setConfirmDelete(id)}
          />
        ))}
        {(!workspaces || workspaces.length === 0) && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-12">
            <p className="text-sm text-gray-500">No workspaces yet</p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-3 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Create your first workspace
            </button>
          </div>
        )}
      </div>

      <CreateWorkspaceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmDelete(null);
          }}
        >
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">
              Are you sure?
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              This action cannot be undone. The workspace and all its jobs will
              be permanently deleted.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate(confirmDelete);
                  setConfirmDelete(null);
                }}
                disabled={deleteMutation.isPending}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
