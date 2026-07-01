import type { RewardInlineNode } from "../model/types";

type InlineContainer = Extract<
  RewardInlineNode,
  { type: "link" | "strong" }
> & {
  children: RewardInlineNode[];
};

const BLOCKED_ELEMENT_PATTERN =
  /<\s*(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const HTML_TAG_PATTERN = /<[^>]+>/g;
const SAFE_HREF_PATTERN = /^(https?:\/\/|mailto:|\/)/i;

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
