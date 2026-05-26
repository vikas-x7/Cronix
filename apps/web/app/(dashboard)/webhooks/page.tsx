import { MdOutlineWebhook } from 'react-icons/md';

export default function WebhooksPage() {
  return (
    <div className="w-full h-screen flex flex-col bg-neutral-950">
      <div className="border-b px-4 py-3 bg-neutral-900/50 border-neutral-800 flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px] text-white">Webhooks</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-12">
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
