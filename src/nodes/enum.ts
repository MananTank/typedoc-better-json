import type { JSONOutput } from "typedoc";
import { EnumDoc } from "../types";
import { getTypeInfo } from "../utils/getReadableType";
import { getSummaryDoc } from "./summary";
import { getBlockTag } from "./blockTag";

export function getEnumDoc(data: JSONOutput.DeclarationReflection): EnumDoc {
  return {
    kind: "enum",
    name: data.name,
    summary: getSummaryDoc(data.comment?.summary),
    source: data.sources?.[0]?.url,
    members: getMembers(data),
    blockTags: data.comment?.blockTags?.map(getBlockTag),
  };
}

function getMembers(data: JSONOutput.DeclarationReflection) {
  if (!data.children) {
    throw new Error(`Failed to get members for enum ${data.name}`);
  }

  const output: EnumDoc["members"] = data.children.map((child) => {
    if (!child.type) {
      throw new Error(`No type found for enum member ${child.name}`);
    }
    return {
      name: child.name,
      value: getTypeInfo(child.type),
      summary: getSummaryDoc(child.comment?.summary),
      blockTags: child.comment?.blockTags?.map(getBlockTag),
    };
  });

  return output;
}
