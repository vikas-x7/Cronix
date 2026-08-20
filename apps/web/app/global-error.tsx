'use client';

import { BiSolidSquare } from 'react-icons/bi';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4">
          <div className="text-center">
            <BiSolidSquare size={40} className="text-[#DF5BCC] mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-white">
              Something went wrong
            </h1>
            <p className="mt-2 text-[13px] text-neutral-500 max-w-md">
              An unexpected error occurred. Please try again or contact support
              if the problem persists.
            </p>
            {error.digest && (
              <p className="mt-2 text-[11px] text-neutral-600 font-mono">
                Error: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              className="mt-6 inline-flex items-center gap-2 rounded-[3px] bg-white px-5 py-2 text-[13px] font-medium text-black transition-colors hover:bg-neutral-200 cursor-pointer"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
