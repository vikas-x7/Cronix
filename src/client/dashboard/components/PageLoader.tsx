'use client';



export default function PageLoader() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="relative w-7 h-7 ">
        <div className="absolute inset-0 border-2 border-[#F5F5F5] rounded-full"></div>
        <div className="absolute inset-0 border-2 border-[#171717] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-[13px] text-black  font-medium animate-pulse">Loading</p>
    </div>
  );
}
