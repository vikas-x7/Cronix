import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import QueryProvider from '@/shared/providers/query-provider';
import ThemeProvider from '@/shared/providers/theme-provider';
import { ToastProvider } from '@/shared/lib/toast';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cronix',
  description: 'Cron job & event automation platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${inter.variable} ${GeistSans.variable} antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>{children}</ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
