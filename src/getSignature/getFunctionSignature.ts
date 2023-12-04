import { FunctionSignature, TypeInfo, TokenInfo } from "../types";

export function getFunctionSignature(
  name: string,
  signature: FunctionSignature,
): TypeInfo {
  const tokens: TokenInfo[] = [];

  const collectTokens = (typeInfo: TypeInfo | undefined) => {
    typeInfo?.tokens?.forEach((t) => tokens.push(t));
  };

  const paramList = signature.parameters
    ? signature.parameters
        .map((param) => {
          const postfix = param.flags?.isOptional ? "?" : "";
          const prefix = param.flags?.isRest ? "..." : "";
          collectTokens(param.type);
          return `${prefix}${param.name}${postfix}: ${param.type?.code}`;
        })
        .join(", ")
    : "";

  const returnType = signature.returns?.type?.code ?? "void";
  collectTokens(signature.returns?.type);

  const typeParams = signature.typeParameters
    ? `<${signature.typeParameters
        .map((param) => {
          const defaultVal = param.defaultType
            ? ` = ${param.defaultType.code}`
            : "";

          collectTokens(param.extendsType);
          collectTokens(param.defaultType);
          return (
            `${param.name}${
              param.extendsType ? ` extends ${param.extendsType.code}` : ""
            }` + defaultVal
          );
        })
        .join(", ")}>`
    : "";

  return {
    code: `function ${name}${typeParams}(${paramList}) : ${returnType}`,
    tokens,
  };
}
