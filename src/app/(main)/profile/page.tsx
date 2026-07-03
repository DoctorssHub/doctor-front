import type { Metadata } from "next";
import { ProfileScreen } from "@/screens/profile";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return <ProfileScreen />;
}
