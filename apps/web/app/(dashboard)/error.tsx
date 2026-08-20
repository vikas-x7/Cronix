'use client';

import { BiSolidSquare } from 'react-icons/bi';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-neutral-950">
      <div className="text-center">
        <BiSolidSquare size={36} className="text-[#DF5BCC] mx-auto mb-4" />
        <h1 className="text-lg font-semibold text-white">
          Something went wrong
        </h1>
        <p className="mt-2 text-[13px] text-neutral-500 max-w-sm">
          An error occurred while loading this page. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-[11px] text-neutral-600 font-mono">
            Error: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="mt-5 inline-flex items-center gap-2 rounded-[3px] bg-white px-4 py-1.5 text-[13px] font-medium text-black transition-colors hover:bg-neutral-200 cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
