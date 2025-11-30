import type { Metadata } from "next";
import HomeClient from "@/app/components/home/HomeClient";

export const metadata: Metadata = {
  title: "Ravono Vendor Compliance – Supercharge Your Vendor Compliance",
  description: "Ravono Vendor Compliance: AI-powered verification & reports for modern Indian businesses. Fast, simple, reliable compliance workflows.",
};

export default function Page() {
  return (
    <div>
      <HomeClient />
    </div>
  );
}