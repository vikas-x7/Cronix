import Link from 'next/link';
import { BiSolidSquare } from 'react-icons/bi';

export default function NotFound() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-neutral-950">
      <div className="text-center">
        <p className="text-5xl font-bold text-neutral-800">404</p>
        <h1 className="mt-3 text-lg font-semibold text-white">
          Page not found
        </h1>
        <p className="mt-1.5 text-[13px] text-neutral-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex items-center gap-2 rounded-[3px] bg-white px-4 py-1.5 text-[13px] font-medium text-black transition-colors hover:bg-neutral-200"
        >
          <BiSolidSquare size={14} className="text-[#DF5BCC]" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
