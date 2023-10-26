import { RootContent } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { SummaryNode } from "../../dist";

function simplifyNode(node: RootContent): SummaryNode {
  delete node.position;

  if ("children" in node) {
    node.children.forEach(simplifyNode);
  }

  return node;
}

export function parseMarkdown(markdown: string): SummaryNode[] {
  const tree = fromMarkdown(markdown, {});
  tree.children.forEach(simplifyNode);
  return tree.children;
}
