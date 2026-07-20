import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getPublicMeta } from "@/lib/account";
import OwnerDashboard from "@/components/owner/OwnerDashboard";
import EmployeeDashboard from "@/components/employee/EmployeeDashboard";
import RoleChooser from "@/components/RoleChooser";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const meta = await getPublicMeta(userId);

  if (meta.role === "owner") return <OwnerDashboard userId={userId} />;
  if (meta.role === "employee") return <EmployeeDashboard userId={userId} />;
  return <RoleChooser />;
}
