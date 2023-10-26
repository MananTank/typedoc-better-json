import { JSONOutput } from "typedoc";
import { BlockTag } from "../../dist";
import { getSummaryDoc } from "./summary";

export function getBlockTag(blockTag: JSONOutput.CommentTag): BlockTag {
  return {
    tag: blockTag.tag,
    name: blockTag.name,
    summary: getSummaryDoc(blockTag.content),
  };
}
