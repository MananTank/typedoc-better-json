import { TypeParameter, TokenInfo, TypeInfo } from "../types";

export function getTypeParamSignature(
  typeParameters: TypeParameter[],
): TypeInfo {
  const tokens: TokenInfo[] = [];

  const collect = (typeInfo?: TypeInfo) => {
    if (typeInfo?.tokens) {
      tokens.push(...typeInfo.tokens);
    }
  };

  const generic = typeParameters
    ? `<${typeParameters
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

  return {
    code: generic,
    tokens,
  };
}
