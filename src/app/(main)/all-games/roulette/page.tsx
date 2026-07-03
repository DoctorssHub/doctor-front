import type { Metadata } from "next";
import { RouletteScreen } from "@/screens/roulette";

export const metadata: Metadata = {
  title: "Roulette",
};

export default function RoulettePage() {
  return <RouletteScreen />;
}
