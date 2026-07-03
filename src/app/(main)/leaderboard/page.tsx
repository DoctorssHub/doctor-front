import type { Metadata } from "next";
import LeaderboardScreen from "@/screens/leaderboard/LeaderboardPage";

export const metadata: Metadata = {
  title: "Leaderboard",
};

export default function LeaderboardPage() {
  return <LeaderboardScreen />;
}
