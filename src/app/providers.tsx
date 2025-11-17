"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react"; 
type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {

  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
