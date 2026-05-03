import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";
import { getDashboardData } from "@/lib/dashboard/data";

export const metadata: Metadata = {
  title: "Dashboard | RainGrid",
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  return <AnalyticsDashboard data={data} />;
}
