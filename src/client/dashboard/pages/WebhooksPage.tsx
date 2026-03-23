import { FiLink } from 'react-icons/fi';
import { MdOutlineWebhook } from 'react-icons/md';

export default function WebhooksPage() {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="border-b px-4  py-3 mt-1 bg-[#FAFAFA] border-[#DDDDDD] flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px]">Webhooks </h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white">
        <div className="border border-dashed border-[#D9D9D9] p-12 flex flex-col items-center justify-center w-full max-w-2xl">
          <MdOutlineWebhook className="text-black/70 mb-4" size={32} />
          
          <h2 className="text-[18px] tracking-normal text-black font-medium">Coming Soon </h2>
          <p className="text-[13px] text-[#383838] mt-2">We are currently building this feature. Check back later!</p>
        </div>
      </div>
    </div>
  );
}
