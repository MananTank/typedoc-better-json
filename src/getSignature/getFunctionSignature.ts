import {
  FunctionSignature,
  TypeInfo,
  TokenInfo,
  FunctionParameter,
} from "../types";

export function getFunctionSignature(
  name: string,
  signature: FunctionSignature,
): TypeInfo {
  const tokens: TokenInfo[] = [];

  const collectTokens = (typeInfo: TypeInfo | undefined) => {
    typeInfo?.tokens?.forEach((t) => tokens.push(t));
  };

  const returnType = signature.returns?.type?.code ?? "void";
  collectTokens(signature.returns?.type);

  let paramList = "";

  if (signature.parameters) {
    const output = getParametersSignature(signature.parameters);
    paramList = output.code;
    output.tokens?.forEach((t) => tokens.push(t));
  }

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

export function getParametersSignature(
  parameters: FunctionParameter[],
): TypeInfo {
  const tokens: TokenInfo[] = [];

  const collectTokens = (typeInfo: TypeInfo | undefined) => {
    typeInfo?.tokens?.forEach((t) => tokens.push(t));
  };

  const paramCode = parameters
    .map((param) => {
      const postfix = param.flags?.isOptional ? "?" : "";
      const prefix = param.flags?.isRest ? "..." : "";
      collectTokens(param.type);

      // convert the (...args: [x: foo, y: bar]) to (x: foo, y: bar)
      const typeCode = param.type?.code || "";

      if (
        prefix &&
        typeCode[0] === "[" &&
        typeCode[typeCode.length - 1] === "]"
      ) {
        return `${typeCode.slice(1, -1)}`;
      }
      return `${prefix}${param.name}${postfix}: ${param.type?.code}`;
    })
    .join(", ");

  return {
    code: paramCode,
    tokens,
  };
}
