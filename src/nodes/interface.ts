import type { JSONOutput } from "typedoc";
import {
  InterfaceDoc,
  SubTypeDeclarationDoc,
  TokenInfo,
  TypeDeclarationDoc,
  TypeInfo,
  TypeParameter,
} from "../types";
import {
  getTypeInfo,
  getFunctionSignatureTypeInfo,
} from "../utils/getReadableType";
import { getSummaryDoc } from "./summary";
import { getFunctionDoc } from "./function";
import { getBlockTag } from "./blockTag";

export function getInterfaceDoc(
  data: JSONOutput.DeclarationReflection,
): InterfaceDoc {
  function getType(): TypeInfo | undefined {
    if (data.type) {
      return getTypeInfo(data.type);
    }

    if (data.children) {
      const tokens: TokenInfo[] = [];

      const code = `{${data.children.map((child) => {
        if (child.type) {
          const typeInfo = getTypeInfo(child.type);
          typeInfo.tokens?.forEach((r) => tokens.push(r));

          return `${child.name} : ${typeInfo.code}`;
        }

        if (child.signatures) {
          const isMulti = child.signatures.length > 1;
          let sigCode = child.signatures
            .map((sig) => {
              const fRef = getFunctionSignatureTypeInfo(sig, isMulti);
              fRef.tokens?.forEach((r) => tokens.push(r));
              return fRef.code;
            })
            .join(" ; ");

          if (isMulti) {
            sigCode = `{ ${sigCode} }`;
          }

          return `${child.name} : ${sigCode}`;
        }
        throw new Error(`Unknown type declaration node ${child.name}`);
      })}}`;

      return {
        code,
      };
    }
  }

  return {
    kind: "type",
    name: data.name,
    summary: getSummaryDoc(data.comment?.summary),
    blockTags: data.comment?.blockTags?.map(getBlockTag),
    source: data.sources?.[0]?.url,
    typeParameters: data.typeParameters?.map((param) => {
      const typeParam: TypeParameter = {
        name: param.name,
        extendsType: param.type ? getTypeInfo(param.type) : undefined,
        defaultType: param.default ? getTypeInfo(param.default) : undefined,
      };
      return typeParam;
    }),
    extends: data.extendedTypes?.map((t) => getTypeInfo(t)),
    type: getType(),
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
        const output: SubTypeDeclarationDoc = {
          kind: "subtype",
          name: child.name,
          type: getTypeInfo(child.type),
          summary: getSummaryDoc(child.comment?.summary),
          blockTags: child.comment?.blockTags?.map(getBlockTag),
        };

        return output;
      }

      throw new Error(`Unknown type declaration node ${child.name}`);
    });
  }
}
