import type { Metadata } from "next";
import { RewardsScreen } from "@/screens";

export const metadata: Metadata = {
  title: "Rewards",
};

export default function RewardsPage() {
  return <RewardsScreen />;
}
