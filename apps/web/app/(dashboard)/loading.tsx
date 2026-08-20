import { BiSolidSquare } from 'react-icons/bi';

export default function DashboardLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-neutral-950">
      <div className="flex flex-col items-center gap-3">
        <BiSolidSquare size={28} className="text-[#DF5BCC] animate-pulse" />
        <p className="text-[13px] text-neutral-500">Loading...</p>
      </div>
    </div>
  );
}
