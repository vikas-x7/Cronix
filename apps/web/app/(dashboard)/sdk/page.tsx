import { FiCode } from 'react-icons/fi';

export default function SdkPage() {
  return (
    <div className="w-full h-full overflow-y-auto bg-[#0D0D0D] pr-2">
      <div className="py-3 bg-[#0D0D0D] shrink-0">
        <h1 className="text-[20px] tracking-[-1px] text-white">SDK</h1>
      </div>
      <div className="bg-[#1F1F1F] rounded-[5px] h-[92vh] flex flex-col items-center justify-center p-12">
        <div className="border border-dashed border-neutral-700 p-12 flex flex-col items-center justify-center w-full max-w-2xl">
          <FiCode className="text-neutral-500 mb-4" size={32} />
          <h2 className="text-[18px] tracking-normal text-white font-medium">
            Coming Soon
          </h2>
          <p className="text-[13px] text-neutral-500 mt-2">
            SDK integration is currently under development. Check back later!
          </p>
        </div>
      </div>
    </div>
  );
}
