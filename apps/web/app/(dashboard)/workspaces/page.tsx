'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiChevronDown, FiClock } from 'react-icons/fi';
import { IoAddSharp } from 'react-icons/io5';
import {
  useWorkspaces,
  useCreateWorkspace,
  useDeleteWorkspace,
  WorkspaceCard,
  CreateWorkspaceModal,
} from '@/modules/workspaces';
import WorkspaceDetailModal from '@/modules/workspaces/components/workspace-detail-modal';
import PageLoader from '@/shared/components/page-loader';
import ConfirmationModal from '@/shared/components/confirmation-modal';
import type { CreateWorkspaceFormData } from '@/modules/workspaces/schemas/workspace.schema';
import type { Workspace } from '@/modules/workspaces/types/workspace.types';

type SortOption = 'newest' | 'oldest' | 'most-jobs' | 'name';

export default function WorkspacesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const { data: workspaces, isLoading, isError, refetch } = useWorkspaces();
  const createMutation = useCreateWorkspace();
  const deleteMutation = useDeleteWorkspace();

  const handleCreate = (data: CreateWorkspaceFormData) => {
    createMutation.mutate(data, { onSuccess: () => setModalOpen(false) });
  };

  const filteredWorkspaces = workspaces
    ?.filter((ws) => ws.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ?.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'oldest':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case 'most-jobs':
          return b.jobsCount - a.jobsCount;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest First',
    oldest: 'Oldest First',
    'most-jobs': 'Most Jobs',
    name: 'Name A-Z',
  };

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <div className="w-full h-full overflow-y-auto bg-[#0D0D0D] pr-2">
        <div className="py-3 bg-[#0D0D0D] flex justify-between items-center">
          <h1 className="text-[20px] -tracking-[1px] text-white">Workspaces</h1>
        </div>
        <div className="bg-[#1F1F1F] rounded-[5px] flex-1 flex flex-col min-h-0">
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
    <div className="w-full h-full flex flex-col bg-[#0D0D0D]">
      <div className="py-3 px-0 bg-[#0D0D0D] shrink-0 flex justify-between items-center">
        <h1 className="text-[20px] tracking-[-1px] text-white">Workspaces</h1>
        <Link href="/schedule">
          <button className="bg-white/90 text-black px-3 py-1.5 rounded-[3px] text-[12px] font-medium flex items-center gap-1.5 hover:bg-neutral-200 transition cursor-pointer mr-2">
            <IoAddSharp size={14} />
            Schedule New Job
          </button>
        </Link>
      </div>

      <div className="bg-[#1F1F1F] rounded-[5px] flex flex-col flex-1 min-h-0">
        <div className="p-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-2 p-1 border border-[#393939] text-[13px] rounded-[3px] font-light text-white/90 hover:bg-neutral-800 transition-colors cursor-pointer outline-none min-w-[130px]"
              >
                {sortLabels[sortBy]}
                <FiChevronDown
                  size={14}
                  className={`ml-auto transition-transform ${sortOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {sortOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-neutral-900 border border-[#393939] rounded-[3px] z-50 overflow-hidden">
                  {(Object.entries(sortLabels) as [SortOption, string][]).map(
                    ([value, label]) => (
                      <button
                        key={value}
                        onClick={() => {
                          setSortBy(value);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-[13px] font-light transition-colors cursor-pointer ${sortBy === value ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-neutral-800 hover:text-white'}`}
                      >
                        {label}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 border border-[#393939] rounded-[3px] px-2 p-0.75 ml-auto">
              <FiSearch size={14} className="text-white/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workspaces..."
                className="text-[13px] font-light text-white/90 outline-none w-60 py-1 transition placeholder:text-neutral-500"
              />
            </div>
          </div>
        </div>

        {!filteredWorkspaces?.length ? (
          <div className="p-4 flex-1">
            <div className="border border-dashed border-neutral-700 py-20 flex flex-col items-center justify-center">
              <FiClock className="text-neutral-500 mb-2" size={24} />
              <p className="text-[16px] tracking-normal text-white">
                {searchQuery ? 'No workspaces found' : 'No workspaces yet'}
              </p>
              <p className="text-[12px] text-neutral-500 mt-1">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Create a new workspace to get started'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="mt-4 cursor-pointer border border-white px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-white hover:text-black"
                >
                  Create your first workspace
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 p-6 overflow-y-auto slim-scrollbar">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-[5px] border border-dashed border-neutral-700 bg-transparent p-5 flex flex-col items-center justify-center min-h-[140px] text-neutral-500 hover:border-neutral-600 hover:text-neutral-400 transition-colors cursor-pointer"
              >
                <span className="text-[24px] mb-1">+</span>
                <span className="text-[12px] font-light">New Workspace</span>
              </button>
              {filteredWorkspaces.map((ws) => (
                <WorkspaceCard
                  key={ws.id}
                  workspace={ws}
                  onDelete={(id, name) => setConfirmDelete({ id, name })}
                  onOpen={(ws) => setSelectedWorkspace(ws)}
                />
              ))}
            </div>
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
        <ConfirmationModal
          isOpen={!!confirmDelete}
          title="Delete Workspace"
          message="This action cannot be undone. The workspace and all its jobs will be permanently deleted."
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          confirmInput={confirmDelete.name}
          onConfirm={() => {
            if (confirmDelete) {
              deleteMutation.mutate(confirmDelete.id);
              setConfirmDelete(null);
            }
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <WorkspaceDetailModal
        workspace={selectedWorkspace}
        onClose={() => setSelectedWorkspace(null)}
      />
    </div>
  );
}
