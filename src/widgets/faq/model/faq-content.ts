export type FaqItem = {
  answer: string;
  question: string;
};

export type FaqToggleLabels = {
  collapseAnswer: string;
  expandAnswer: string;
};

export const homepageFaqItems: FaqItem[] = [
  {
    answer:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    question: "Question close",
  },
  {
    answer:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    question: "Question open",
  },
  {
    answer:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    question: "Question close",
  },
  {
    answer:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    question: "Question close",
  },
  {
    answer:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    question: "Question close",
  },
];

export const homepageFaqTitle = "Frequently asked questions";

export const homepageFaqToggleLabels: FaqToggleLabels = {
  collapseAnswer: "Collapse answer",
  expandAnswer: "Expand answer",
};

export const rewardsFaqItems: FaqItem[] = [
  {
    answer:
      "Rewards are limited-time campaigns, bonuses, and giveaways from TheDoctor for the community. Each card on this page is a separate campaign with its own terms and prizes.",
    question: "What are rewards?",
  },
  {
    answer:
      "Open the reward card to see the full campaign details and terms, then follow the action button. Depending on the campaign, it can take you to DegenCity, Discord, or another official destination to complete the claim.",
    question: "How do I claim a reward?",
  },
  {
    answer:
      "Most rewards require a DegenCity account registered under code THEDOCTOR and a linked Discord. Each campaign lists its own conditions, and entries go through eligibility checks before fulfillment.",
    question: "Who can participate?",
  },
  {
    answer:
      "Rewards with an end date show a countdown timer - claim them before it runs out. Rewards without a timer stay active until they are updated or hidden.",
    question: "How long do rewards stay active?",
  },
  {
    answer:
      "Expired rewards are removed from the list and can no longer be claimed, but new campaigns appear regularly - check back or follow announcements in Discord.",
    question: "What happens when a reward expires?",
  },
];

export const rewardsFaqTitle = "Frequently asked questions";

export const rewardsFaqToggleLabels: FaqToggleLabels = {
  collapseAnswer: "Collapse answer",
  expandAnswer: "Expand answer",
};
