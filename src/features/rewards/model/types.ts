export type RewardSort = "createdAtDesc";

export type RewardQuery = {
  page?: number;
  search?: string;
  sort?: RewardSort;
  take?: number;
};

export type RewardQueryParams = {
  page: number;
  search?: string;
  sort: RewardSort;
  take: number;
};

export type Reward = {
  endDate: string;
  id: string;
  photoUrl: string;
  shortDescription: string;
  title: string;
};

export type RewardsResponse = {
  items: Reward[];
  page: number;
  take: number;
  total: number;
  totalPages: number;
};

export type RewardContentAlignment = "center" | "left" | "right";

type RewardContentTune = {
  alignmentTune?: {
    alignment?: RewardContentAlignment;
  };
};

export type RewardInlineNode =
  | {
      text: string;
      type: "text";
    }
  | {
      type: "lineBreak";
    }
  | {
      children: RewardInlineNode[];
      type: "strong";
    }
  | {
      children: RewardInlineNode[];
      href: string;
      type: "link";
    };

export type RewardParagraphBlock = {
  data: {
    nodes: RewardInlineNode[];
  };
  id: string;
  tunes?: RewardContentTune;
  type: "paragraph";
};

export type RewardContentBlock = RewardParagraphBlock;

export type RewardContent = {
  blocks: RewardContentBlock[];
  time: number;
  version: string;
};

export type RewardDetails = Reward & {
  content: RewardContent;
};
