import type { Metadata } from "next";
import Admin from "@/app/components/Admin";
import "@/app/components/Admin.css";

export const metadata: Metadata = {
  title: "Admin | Abhijit Satyaki",
  description: "Admin panel.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <Admin />;
}
