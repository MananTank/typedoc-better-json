import type { JSONOutput } from "typedoc";
import { parseMarkdown } from "../utils/markdown";
import { Summary } from "../types";

export function getSummaryDoc(
  summary?: JSONOutput.CommentDisplayPart[],
): Summary | undefined {
  if (!summary) return undefined;

  const summaryJoin = summary
    .map((s) => {
      if (s.kind === "inline-tag") {
        if (s.tag === "@link") {
          const target = s.target;
          if (target) {
            if (typeof target === "string") {
              return `[${s.text}](${target})`;
            }
          }
        }
      }

      return s.text;
    })
    .join("");

  return parseMarkdown(summaryJoin);
}
