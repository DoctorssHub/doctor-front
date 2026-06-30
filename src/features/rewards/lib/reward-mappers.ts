import type {
  Reward,
  RewardContent,
  RewardContentAlignment,
  RewardDetails,
  RewardInlineNode,
  RewardsResponse,
} from "../model/types";

type InlineContainer = Extract<
  RewardInlineNode,
  { type: "link" | "strong" }
> & {
  children: RewardInlineNode[];
};

type RawRecord = Record<string, unknown>;

const BLOCKED_ELEMENT_PATTERN =
  /<\s*(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const HTML_TAG_PATTERN = /<[^>]+>/g;
const SAFE_HREF_PATTERN = /^(https?:\/\/|mailto:|\/)/i;

export function mapRewardsResponse(response: unknown): RewardsResponse {
  const data = asRecord(response);
  const rewards = Array.isArray(data.data) ? data.data : [];

  return {
    items: rewards.map(mapRewardResponse),
    page: readNumber(data.page),
    take: readNumber(data.take),
    total: readNumber(data.total),
    totalPages: readNumber(data.totalPages),
  };
}

export function mapRewardDetailsResponse(response: unknown): RewardDetails {
  const data = asRecord(response);

  return {
    ...mapRewardResponse(data),
    content: mapRewardContent(data.content),
  };
}

export function parseRewardInlineContent(html: string): RewardInlineNode[] {
  const root: RewardInlineNode[] = [];
  const stack: InlineContainer[] = [];
  const safeHtml = html.replace(BLOCKED_ELEMENT_PATTERN, "");
  let cursor = 0;

  for (const tagMatch of safeHtml.matchAll(HTML_TAG_PATTERN)) {
    const tag = tagMatch[0];
    const index = tagMatch.index ?? 0;

    appendText(safeHtml.slice(cursor, index), stack, root);
    handleTag(tag, stack, root);
    cursor = index + tag.length;
  }

  appendText(safeHtml.slice(cursor), stack, root);

  while (stack.length > 0) {
    const node = stack.pop();

    if (node) {
      appendNode(node, stack, root);
    }
  }

  return root;
}

function mapRewardResponse(response: unknown): Reward {
  const data = asRecord(response);

  return {
    endDate: readString(data.endDate),
    id: readString(data.id),
    photoUrl: readString(data.photoUrl),
    shortDescription: readString(data.shortDescription),
    title: readString(data.title),
  };
}

function mapRewardContent(response: unknown): RewardContent {
  const data = asRecord(response);
  const blocks = Array.isArray(data.blocks) ? data.blocks : [];

  return {
    blocks: blocks.flatMap((block) => {
      const paragraph = mapParagraphBlock(block);

      return paragraph ? [paragraph] : [];
    }),
    time: readNumber(data.time),
    version: readString(data.version),
  };
}

function mapParagraphBlock(
  response: unknown,
): RewardContent["blocks"][number] | null {
  const block = asRecord(response);

  if (block.type !== "paragraph") {
    return null;
  }

  const data = asRecord(block.data);
  const text = readString(data.text);
  const tunes = mapAlignmentTune(block.tunes);

  return {
    data: {
      nodes: parseRewardInlineContent(text),
    },
    id: readString(block.id),
    ...(tunes ? { tunes } : {}),
    type: "paragraph",
  };
}

function mapAlignmentTune(response: unknown) {
  const tunes = asRecord(response);
  const alignmentTune = asRecord(tunes.alignmentTune);
  const alignment = readAlignment(alignmentTune.alignment);

  if (!alignment) {
    return undefined;
  }

  return {
    alignmentTune: {
      alignment,
    },
  };
}

function readAlignment(value: unknown): RewardContentAlignment | undefined {
  if (value === "center" || value === "left" || value === "right") {
    return value;
  }

  return undefined;
}

function appendText(
  text: string,
  stack: InlineContainer[],
  root: RewardInlineNode[],
) {
  if (!text) {
    return;
  }

  appendNode({ text: decodeHtmlEntities(text), type: "text" }, stack, root);
}

function appendNode(
  node: RewardInlineNode,
  stack: InlineContainer[],
  root: RewardInlineNode[],
) {
  const parent = stack.at(-1);

  if (parent) {
    parent.children.push(node);
    return;
  }

  root.push(node);
}

function handleTag(
  tag: string,
  stack: InlineContainer[],
  root: RewardInlineNode[],
) {
  const tagName = getTagName(tag);

  if (!tagName) {
    return;
  }

  if (tagName === "br") {
    appendNode({ type: "lineBreak" }, stack, root);
    return;
  }

  if (isClosingTag(tag)) {
    closeInlineNode(tagName, stack, root);
    return;
  }

  if (tagName === "b" || tagName === "strong") {
    stack.push({ children: [], type: "strong" });
    return;
  }

  if (tagName === "a") {
    const href = getSafeHref(tag);

    if (href) {
      stack.push({ children: [], href, type: "link" });
    }
  }
}

function closeInlineNode(
  tagName: string,
  stack: InlineContainer[],
  root: RewardInlineNode[],
) {
  const expectedType = tagName === "a" ? "link" : "strong";
  const current = stack.at(-1);

  if (!current || current.type !== expectedType) {
    return;
  }

  const node = stack.pop();

  if (node) {
    appendNode(node, stack, root);
  }
}

function getTagName(tag: string) {
  return tag.match(/^<\s*\/?\s*([a-z0-9]+)/i)?.[1]?.toLowerCase();
}

function isClosingTag(tag: string) {
  return /^<\s*\//.test(tag);
}

function getSafeHref(tag: string) {
  const href = tag.match(/\shref\s*=\s*(["'])(.*?)\1/i)?.[2]?.trim();

  if (!href || !SAFE_HREF_PATTERN.test(href)) {
    return undefined;
  }

  return decodeHtmlEntities(href);
}

function decodeHtmlEntities(value: string) {
  return value.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (entity, code) => {
    const normalizedCode = code.toLowerCase();

    if (normalizedCode === "amp") {
      return "&";
    }

    if (normalizedCode === "lt") {
      return "<";
    }

    if (normalizedCode === "gt") {
      return ">";
    }

    if (normalizedCode === "quot") {
      return '"';
    }

    if (normalizedCode === "apos" || normalizedCode === "#39") {
      return "'";
    }

    if (normalizedCode === "nbsp") {
      return " ";
    }

    if (normalizedCode.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(normalizedCode.slice(2), 16));
    }

    if (normalizedCode.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(normalizedCode.slice(1), 10));
    }

    return entity;
  });
}

function asRecord(value: unknown): RawRecord {
  if (typeof value === "object" && value !== null) {
    return value as RawRecord;
  }

  return {};
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}
