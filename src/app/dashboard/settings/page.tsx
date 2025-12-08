import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Settings from '@/client/dashboard/pages/Settings';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: true,
      cronJobs: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return <Settings user={user} />;
}