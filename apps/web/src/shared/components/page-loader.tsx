export default function PageLoader() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-neutral-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-700 border-t-white" />
        <p className="text-[13px] text-neutral-500">Loading...</p>
      </div>
    </div>
  );
}
