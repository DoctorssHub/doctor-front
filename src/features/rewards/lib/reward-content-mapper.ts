import type {
  RewardContent,
  RewardContentAlignment,
} from "../model/types";
import { asRecord, readNumber, readString } from "./reward-mapper-utils";
import { parseRewardInlineContent } from "./reward-inline-parser";

export function mapRewardContent(response: unknown): RewardContent {
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
