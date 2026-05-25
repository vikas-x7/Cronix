export default function PageLoader() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#171717]" />
        <p className="text-[13px] text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}
