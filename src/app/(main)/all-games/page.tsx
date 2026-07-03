import type { Metadata } from "next";
import { AllGamesScreen } from "@/screens/all-games";

export const metadata: Metadata = {
  title: "All Games",
};

export default function AllGamesPage() {
  return <AllGamesScreen />;
}
