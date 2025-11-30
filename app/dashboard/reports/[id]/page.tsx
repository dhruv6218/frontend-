import { MOCK_REPORTS } from "@/lib/mock/data";
import ReportDetailClient from "./client";

export async function generateStaticParams() {
  return MOCK_REPORTS.map((report) => ({
    id: report.id,
  }));
}

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReportDetailClient id={id} />;
}
