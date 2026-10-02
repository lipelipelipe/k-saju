import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Painel do site · SAJU", robots: { index: false, follow: false } };

export default function DashboardPage() {
  return <Dashboard />;
}
