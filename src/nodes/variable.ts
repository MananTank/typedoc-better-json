import type { JSONOutput } from "typedoc";
import { VariableDoc, TypeDeclarationDoc } from "../types";
import { getReadableType } from "../utils/getReadableType";
import { getFunctionDoc } from "./function";
import { getSummaryDoc } from "./summary";
import { getBlockTag } from "./blockTag";

export function getVariableDoc(
  data: JSONOutput.DeclarationReflection,
): VariableDoc {
  return {
    kind: "variable",
    name: data.name,
    summary: getSummaryDoc(data.comment?.summary),
    source: data.sources?.[0]?.url,
    type: data.type ? getReadableType(data.type) : undefined,
    typeDeclaration: data.type
      ? getDeclaration(data.type, data.name)
      : undefined,
    flags: Object.keys(data.flags).length > 0 ? data.flags : undefined,
  };
}

function getDeclaration(
  typeObj: JSONOutput.SomeType,
  varName?: string,
): TypeDeclarationDoc[] | undefined {
  if (typeObj.type === "reflection") {
    const mainOutput: TypeDeclarationDoc[] = [];

    if (typeObj.declaration.signatures) {
      const fnDoc = getFunctionDoc(typeObj.declaration);
      if (varName) {
        fnDoc.name = varName;
      }
      mainOutput.push(fnDoc);
    }

    if (typeObj.declaration.children) {
      const output = typeObj.declaration.children?.map((child) => {
        if (child.signatures) {
          const output: TypeDeclarationDoc = getFunctionDoc(child);
          return output;
        }

        // when property is a assigned arrow function
        // Example: { bar: (a: number) => a + 2 }
        if (
          child.type?.type === "reflection" &&
          child.type.declaration.signatures
        ) {
          const output: TypeDeclarationDoc = getFunctionDoc(
            child.type.declaration,
          );
          // fix wrong name ( this is kinda hacky )
          output.name = child.name;
          return output;
        }

        if (child.type) {
          const output: TypeDeclarationDoc = {
            kind: "subtype",
            name: child.name,
            type: getReadableType(child.type),
            summary: getSummaryDoc(child.comment?.summary),
            blockTags: child.comment?.blockTags?.map(getBlockTag),
          };

          return output;
        }

        throw new Error(`Unknown type declaration node ${child.name}`);
      });

      mainOutput.push(...output);
    }

    if (mainOutput.length !== 0) {
      return mainOutput;
    }
  }

  if (typeObj.type === "array") {
    return getDeclaration(typeObj.elementType);
  }
}
