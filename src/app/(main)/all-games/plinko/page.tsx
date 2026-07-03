import type { Metadata } from "next";
import { PlinkoScreen } from "@/screens/plinko";

export const metadata: Metadata = {
  title: "Plinko",
};

export default function PlinkoPage() {
  return <PlinkoScreen />;
}
