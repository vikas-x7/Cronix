'use client';

import { useEffect, useState } from 'react';
import { FiWifi, FiWifiOff } from 'react-icons/fi';

export default function OfflineStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/95 backdrop-blur-sm">
      <div className="text-center px-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <FiWifiOff size={28} className="text-red-400" />
        </div>
        <h1 className="text-xl font-semibold text-white">
          No Internet Connection
        </h1>
        <p className="mt-2 text-[13px] text-neutral-500 max-w-sm">
          Please check your network connection and try again. The application
          requires an active internet connection.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-[3px] bg-white px-5 py-2 text-[13px] font-medium text-black transition-colors hover:bg-neutral-200 cursor-pointer"
        >
          <FiWifi size={14} />
          Retry
        </button>
      </div>
    </div>
  );
}
