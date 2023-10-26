import type { JSONOutput } from "typedoc";
import { parseMarkdown } from "../utils/markdown";
import { Summary } from "../../dist";

export function getSummaryDoc(
  summary?: JSONOutput.CommentDisplayPart[],
): Summary | undefined {
  if (!summary) return undefined;

  const summaryJoin = summary
    .map((s) => {
      if (s.kind === "inline-tag") {
        if (s.tag === "@link") {
          return `[${s.text}](${s.target})`;
        }
      }

      return s.text;
    })
    .join("");

  return parseMarkdown(summaryJoin);
}
