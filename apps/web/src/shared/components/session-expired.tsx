import Link from 'next/link';
import { BiSolidSquare } from 'react-icons/bi';
import { HiOutlineClock } from 'react-icons/hi2';

export default function SessionExpired() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <HiOutlineClock size={28} className="text-amber-400" />
        </div>
        <h1 className="text-xl font-semibold text-white">Session Expired</h1>
        <p className="mt-2 text-[13px] text-neutral-500 max-w-sm">
          Your session has expired. Please sign in again to continue.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-[3px] bg-white px-5 py-2 text-[13px] font-medium text-black transition-colors hover:bg-neutral-200"
        >
          <BiSolidSquare size={14} className="text-[#DF5BCC]" />
          Sign In
        </Link>
      </div>
    </div>
  );
}
