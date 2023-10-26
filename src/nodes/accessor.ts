import type { JSONOutput } from "typedoc";
import { AccessorDoc } from "../types";
import { getReadableType } from "../utils/getReadableType";
import { getSummaryDoc } from "./summary";
import { getBlockTag } from "./blockTag";

export function getAccessorDoc(
  data: JSONOutput.DeclarationReflection,
): AccessorDoc {
  return {
    kind: "accessor",
    name: data.name,
    source: data.sources?.[0]?.url,
    summary: getSummaryDoc(data.comment?.summary),
    returns: data.getSignature
      ? {
          type: data.getSignature.type
            ? getReadableType(data.getSignature.type)
            : undefined,
          summary: getSummaryDoc(
            data.getSignature.comment?.blockTags?.find(
              (tag) => tag.tag === "@returns",
            )?.content,
          ),
        }
      : undefined,
    blockTags: data.comment?.blockTags
      ?.filter((w) => w.tag !== "@returns")
      .map(getBlockTag),
    flags: Object.keys(data.flags).length > 0 ? data.flags : undefined,
  };
}
