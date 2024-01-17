import type { JSONOutput } from "typedoc";
import { AccessorDoc } from "../types";
import { getTypeInfo } from "../utils/getReadableType";
import { getSummaryDoc } from "./summary";
import { getBlockTag } from "./blockTag";

export function getAccessorDoc(
  data: JSONOutput.DeclarationReflection,
): AccessorDoc {
  const sig = data.getSignature;
  return {
    kind: "accessor",
    name: data.name,
    source: sig?.sources?.[0]?.url,
    summary: sig ? getSummaryDoc(sig.comment?.summary) : undefined,
    returns: sig
      ? {
          type: sig.type ? getTypeInfo(sig.type) : undefined,
          summary: getSummaryDoc(
            sig.comment?.blockTags?.find((tag) => tag.tag === "@returns")
              ?.content,
          ),
        }
      : undefined,
    blockTags: sig?.comment?.blockTags
      ?.filter((w) => w.tag !== "@returns")
      .map(getBlockTag),
    flags: sig
      ? Object.keys(sig.flags).length > 0
        ? sig.flags
        : undefined
      : undefined,
  };
}
