import { RewardDetailsPageView } from "@/features/rewards";

type RewardDetailsScreenProps = {
  rewardId: string;
};

export function RewardDetailsScreen({ rewardId }: RewardDetailsScreenProps) {
  return <RewardDetailsPageView rewardId={rewardId} />;
}
