import { BiSolidSquare } from 'react-icons/bi';
import { HiOutlineWrench } from 'react-icons/hi2';

export default function Maintenance() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#DF5BCC]/10">
          <HiOutlineWrench size={28} className="text-[#DF5BCC]" />
        </div>
        <h1 className="text-xl font-semibold text-white">Under Maintenance</h1>
        <p className="mt-2 text-[13px] text-neutral-500 max-w-sm">
          We are currently performing scheduled maintenance. Please check back
          shortly.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <BiSolidSquare size={12} className="text-[#DF5BCC] animate-pulse" />
          <p className="text-[11px] text-neutral-600">
            We&apos;ll be back soon
          </p>
        </div>
      </div>
    </div>
  );
}
