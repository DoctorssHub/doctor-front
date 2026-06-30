import type {
  RewardContent,
  RewardContentAlignment,
  RewardContentBlock,
  RewardInlineNode,
} from "../../model/types";

type RewardContentRendererProps = {
  content: RewardContent;
};

export function RewardContentRenderer({ content }: RewardContentRendererProps) {
  return (
    <div className="flex flex-col gap-3">
      {content.blocks.map((block) => (
        <RewardContentBlockView block={block} key={block.id} />
      ))}
    </div>
  );
}

type RewardContentBlockViewProps = {
  block: RewardContentBlock;
};

function RewardContentBlockView({ block }: RewardContentBlockViewProps) {
  const alignmentClass = getAlignmentClass(
    block.tunes?.alignmentTune?.alignment,
  );

  if (block.type === "paragraph") {
    return (
      <p
        className={`text-[18px] leading-[133%] font-normal text-[#6b7280] [&_a]:text-[#22c55e] [&_a]:underline [&_strong]:font-semibold [&_b]:font-semibold ${alignmentClass}`}
      >
        {block.data.nodes.map((node, index) => (
          <RewardInlineNodeView key={index} node={node} />
        ))}
      </p>
    );
  }

  return null;
}

type RewardInlineNodeViewProps = {
  node: RewardInlineNode;
};

function RewardInlineNodeView({ node }: RewardInlineNodeViewProps) {
  if (node.type === "text") {
    return node.text;
  }

  if (node.type === "lineBreak") {
    return <br />;
  }

  if (node.type === "strong") {
    return (
      <strong>
        {node.children.map((child, index) => (
          <RewardInlineNodeView key={index} node={child} />
        ))}
      </strong>
    );
  }

  return (
    <a href={node.href} rel="noreferrer" target="_blank">
      {node.children.map((child, index) => (
        <RewardInlineNodeView key={index} node={child} />
      ))}
    </a>
  );
}

function getAlignmentClass(alignment?: RewardContentAlignment) {
  if (alignment === "center") {
    return "text-center";
  }

  if (alignment === "right") {
    return "text-right";
  }

  return "text-left";
}
