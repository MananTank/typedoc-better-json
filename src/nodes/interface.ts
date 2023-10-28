import type { JSONOutput } from "typedoc";
import {
  InterfaceDoc,
  SubTypeDeclarationDoc,
  TypeDeclarationDoc,
  TypeParameter,
} from "../types";
import {
  getReadableType,
  readableFunctionSignature,
} from "../utils/getReadableType";
import { getSummaryDoc } from "./summary";
import { getFunctionDoc } from "./function";

export function getInterfaceDoc(
  data: JSONOutput.DeclarationReflection,
): InterfaceDoc {
  return {
    kind: "type",
    name: data.name,
    summary: getSummaryDoc(data.comment?.summary),
    source: data.sources?.[0]?.url,
    typeParameters: data.typeParameters?.map((param) => {
      const typeParam: TypeParameter = {
        name: param.name,
        extendsType: param.type ? getReadableType(param.type) : undefined,
      };
      return typeParam;
    }),
    // could be a type, could be children array -> object
    type: data.type
      ? getReadableType(data.type)
      : data.children
      ? `{${data.children.map((child) => {
          if (child.type) {
            return `${child.name} : ${getReadableType(child.type)}`;
          }
          if (child.signatures) {
            return child.signatures
              .map((sig) => {
                return `${sig.name} : ${readableFunctionSignature(sig)}`;
              })
              .join(" ; ");
          }
          throw new Error(`Unknown type declaration node ${child.name}`);
        })}}`
      : undefined,
    typeDeclaration: getDeclaration(data),
  };
}

function getDeclaration(
  data: JSONOutput.DeclarationReflection,
): TypeDeclarationDoc[] | undefined {
  const typeObj = data.type;

  const children =
    data.children ||
    (typeObj && "declaration" in typeObj
      ? typeObj.declaration.children
      : undefined);

  if (children) {
    return children.map((child) => {
      if (child.signatures) {
        return getFunctionDoc(child);
      }

      if (child.type) {
        const output: SubTypeDeclarationDoc = {
          kind: "subtype",
          name: child.name,
          type: getReadableType(child.type),
          summary: getSummaryDoc(child.comment?.summary),
        };

        return output;
      }

      throw new Error(`Unknown type declaration node ${child.name}`);
    });
  }
}
