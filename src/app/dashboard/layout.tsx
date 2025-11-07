import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth";

type DashboardRouteLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardRouteLayout({
  children,
}: DashboardRouteLayoutProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return children;
}
