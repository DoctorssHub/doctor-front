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
