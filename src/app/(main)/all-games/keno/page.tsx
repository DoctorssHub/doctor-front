import type { Metadata } from "next";
import { KenoScreen } from "@/screens/keno";

export const metadata: Metadata = {
  title: "Keno",
};

export default function KenoPage() {
  return <KenoScreen />;
}
