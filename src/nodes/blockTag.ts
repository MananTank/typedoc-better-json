import { JSONOutput } from "typedoc";
import { getSummaryDoc } from "./summary";
import { BlockTag } from "../types";

export function getBlockTag(blockTag: JSONOutput.CommentTag): BlockTag {
  return {
    tag: blockTag.tag,
    name: blockTag.name,
    summary: getSummaryDoc(blockTag.content),
  };
}
