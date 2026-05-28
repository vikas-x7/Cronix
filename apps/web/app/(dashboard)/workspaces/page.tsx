'use client';

import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import {
  useWorkspaces,
  useCreateWorkspace,
  useDeleteWorkspace,
  WorkspaceCard,
  CreateWorkspaceModal,
} from '@/modules/workspaces';
import PageLoader from '@/shared/components/page-loader';
import ConfirmationModal from '@/shared/components/confirmation-modal';
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

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <div className="w-full h-screen overflow-y-auto bg-[#0D0D0D] pr-2">
        <div className="py-3 bg-[#0D0D0D] flex justify-between items-center">
          <h1 className="text-[20px] -tracking-[1px] text-white">Workspaces</h1>
        </div>
        <div className="bg-[#1F1F1F] rounded-[10px] h-[92vh] flex flex-col items-center justify-center">
          <p className="text-[13px] text-neutral-500">
            Failed to load workspaces
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 cursor-pointer border border-neutral-700 px-4 py-2 text-[12px] font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#0D0D0D] pr-2">
      <div className="py-3 bg-[#0D0D0D] flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px] text-white">Workspaces</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#252525] border border-white/5 rounded-[2px] text-white/90 px-2 py-1.5 text-[12px] font-medium flex items-center justify-center gap-1 hover:bg-neutral-200 transition"
        >
          <IoAdd size={18} />
          New Workspace
        </button>
      </div>
      <div className="bg-[#1F1F1F] rounded-[10px] h-[92vh] overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6">
          {workspaces?.map((ws) => (
            <WorkspaceCard
              key={ws.id}
              workspace={ws}
              onDelete={(id) => setConfirmDelete(id)}
            />
          ))}
          {(!workspaces || workspaces.length === 0) && (
            <div className="col-span-full border border-dashed border-neutral-700 flex flex-col items-center justify-center p-12">
              <p className="text-[13px] text-neutral-500">No workspaces yet</p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-3 cursor-pointer border border-white px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-white hover:text-black"
              >
                Create your first workspace
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateWorkspaceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />

      {confirmDelete && (
        <ConfirmationModal
          isOpen={!!confirmDelete}
          title="Delete Workspace"
          message="This action cannot be undone. The workspace and all its jobs will be permanently deleted."
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          onConfirm={() => {
            if (confirmDelete) {
              deleteMutation.mutate(confirmDelete);
              setConfirmDelete(null);
            }
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
