import type { JSONOutput } from "typedoc";
import { InterfaceDoc, TypeDeclarationDoc } from "../types";
import { getReadableType } from "../utils/getReadableType";
import { getSummaryDoc } from "./summary";

export function getInterfaceDoc(
  data: JSONOutput.DeclarationReflection,
): InterfaceDoc {
  return {
    kind: "type",
    name: data.name,
    summary: getSummaryDoc(data.comment?.summary),
    source: data.sources?.[0]?.url,
    type: data.type ? getReadableType(data.type) : undefined,
    typeDeclaration: getDeclaration(data.type),
  };
}

function getDeclaration(
  typeObj?: JSONOutput.SomeType,
): TypeDeclarationDoc[] | undefined {
  if (typeObj?.type !== "reflection") {
    return undefined;
  }

  return typeObj.declaration.children?.map((child) => {
    if (!child.type) {
      throw new Error(`No type found for type declaration ${child.name}`);
    }
    const output: TypeDeclarationDoc = {
      name: child.name,
      type: getReadableType(child.type),
      summary: getSummaryDoc(child.comment?.summary),
    };

    return output;
  });
}
