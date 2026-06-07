import Link from 'next/link';
import { MdOutlineWebhook } from 'react-icons/md';
import { IoAddSharp } from 'react-icons/io5';

export default function WebhooksPage() {
  return (
    <div className="w-full h-screen overflow-y-auto bg-[#0D0D0D] pr-2">
      <div className="py-3 bg-[#0D0D0D] flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px] text-white">Webhooks</h1>
        <Link href="/schedule">
          <button className="bg-white text-black px-3 py-1.5 rounded-[3px] text-[12px] font-medium flex items-center gap-1.5 hover:bg-neutral-200 transition cursor-pointer">
            <IoAddSharp size={14} />
            Schedule New Job
          </button>
        </Link>
      </div>
      <div className="bg-[#1F1F1F] rounded-[10px] h-[92vh] flex flex-col items-center justify-center p-12">
        <div className="border border-dashed border-neutral-700 p-12 flex flex-col items-center justify-center w-full max-w-2xl">
          <MdOutlineWebhook className="text-neutral-500 mb-4" size={32} />
          <h2 className="text-[18px] tracking-normal text-white font-medium">
            Coming Soon
          </h2>
          <p className="text-[13px] text-neutral-500 mt-2">
            We are currently building this feature. Check back later!
          </p>
        </div>
      </div>
    </div>
  );
}
