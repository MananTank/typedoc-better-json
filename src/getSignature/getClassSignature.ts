import { ClassDoc, TypeInfo, TokenInfo } from "../types";
import { getTypeParamSignature } from "./getTypeParamSignature";

export function getClassSignature(classDoc: ClassDoc): TypeInfo {
  const tokens: TokenInfo[] = [];

  const collect = (typeInfo?: TypeInfo) => {
    if (typeInfo?.tokens) {
      tokens.push(...typeInfo.tokens);
    }
  };

  let generic = "";
  if (classDoc.typeParameters) {
    const typeParams = getTypeParamSignature(classDoc.typeParameters);
    generic = typeParams.code;
    collect(typeParams);
  }

  const implmentsStr = classDoc.implements
    ? `implements ${classDoc.implements
        .map((i) => {
          collect(i);
          return i.code;
        })
        ?.join(", ")}`
    : "";

  const extendsStr = classDoc.extends
    ? `extends ${classDoc.extends
        ?.map((ex) => {
          collect(ex);
          return ex.code;
        })
        .join(", ")}`
    : "";

  const code = `class ${classDoc.name}${generic} ${[
    extendsStr,
    implmentsStr,
  ].join(" ")} {}`;

  return {
    code,
    tokens,
  };
}
