import type { Metadata } from "next";
import { DiceScreen } from "@/screens/dice";

export const metadata: Metadata = {
  title: "Dice",
};

export default function DicePage() {
  return <DiceScreen />;
}
