import { InterfaceDoc, TokenInfo, TypeInfo } from "../types";

export function getInterfaceSignature(doc: InterfaceDoc): TypeInfo {
  if (!doc.type)
    return {
      code: doc.name,
    };

  let code: string;
  const tokens: TokenInfo[] = [];

  const collectTokens = (typeInfo?: TypeInfo) => {
    if (typeInfo?.tokens) {
      tokens.push(...typeInfo.tokens);
    }
  };

  const generic = doc.typeParameters
    ? `<${doc.typeParameters
        .map((t) => {
          collectTokens(t.extendsType);
          collectTokens(t.defaultType);

          const defaultVal = t.defaultType ? ` = ${t.defaultType.code}` : "";
          return (
            (t.extendsType
              ? `${t.name} extends ${t.extendsType.code}`
              : t.name) + defaultVal
          );
        })
        .join(", ")}>`
    : "";

  if (doc.extends) {
    const extendsClause = doc.extends
      ? `extends ${doc.extends
          .map((ext) => {
            collectTokens(ext);
            return ext.code;
          })
          .join(", ")}`
      : "";

    code = `interface ${doc.name}${generic} ${extendsClause} ${doc.type.code}`;
  } else {
    code = `type ${doc.name}${generic} = ${doc.type.code}`;
  }

  collectTokens(doc.type);

  return {
    code,
    tokens,
  };
}
