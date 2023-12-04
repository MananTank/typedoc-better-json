import { ClassDoc, TypeInfo, TokenInfo } from "../types";

export function getClassSignature(classDoc: ClassDoc): TypeInfo {
  const tokens: TokenInfo[] = [];

  const collect = (typeInfo?: TypeInfo) => {
    if (typeInfo?.tokens) {
      tokens.push(...typeInfo.tokens);
    }
  };

  const generic = classDoc.typeParameters
    ? `<${classDoc.typeParameters
        .map((t) => {
          collect(t.defaultType);
          collect(t.extendsType);

          const defaultVal = t.defaultType ? ` = ${t.defaultType.code}` : "";
          return (
            (t.extendsType
              ? `${t.name} extends ${t.extendsType.code}`
              : t.name) + defaultVal
          );
        })
        .join(", ")}>`
    : "";

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
