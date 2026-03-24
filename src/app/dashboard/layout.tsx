import { redirect } from "next/navigation";
import Sidebar from "@/client/dashboard/layout/Sidebar";
import ToastContainer from "@/client/dashboard/components/Toast";
import { getAuthSession } from "@/lib/auth";

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

  return (
    <div className="flex bg-white font-inter">
      <div className="w-70 ">
        
        <Sidebar />
      </div>
      <main className="h-screen w-full overflow-y-scroll slim-scrollbar">
        <div>{children}</div>
        <ToastContainer />
      </main>
    </div>
  );
}
