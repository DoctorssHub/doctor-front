import { RewardDetailsScreen } from "@/screens";

type RewardDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RewardDetailsPage({
  params,
}: RewardDetailsPageProps) {
  const { id } = await params;

  return <RewardDetailsScreen rewardId={id} />;
}
