import DashboardLayout from "@/src/client/dashboard/layout/DashboardLayout";
import DashboardHome from "@/src/client/dashboard/pages/DashboardHome";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  );
}
