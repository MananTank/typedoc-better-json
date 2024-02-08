import type { JSONOutput } from "typedoc";
import { TokenInfo, TypeInfo } from "../types";
import { getParametersSignature } from "../getSignature/getFunctionSignature";
import { getFunctionParametersDoc } from "../nodes/function";

export function getTypeInfo(typeObj: JSONOutput.SomeType): TypeInfo {
  const tokens: TokenInfo[] = [];

  const collectTokens = (typeInfo?: TypeInfo) => {
    if (typeInfo?.tokens) {
      tokens.push(...typeInfo.tokens);
    }
  };

  function getCode(): string {
    switch (typeObj.type) {
      // string, number, boolean, etc
      case "intrinsic": {
        return typeObj.name;
      }

      // { key: value } or { key: () => Bar  }
      case "reflection": {
        let inner = "";
        if (typeObj.declaration.children) {
          inner = `${typeObj.declaration.children
            ?.map((child) => {
              const keyName = createValidKey(child.name);

              if (child.type) {
                const typeInfo = getTypeInfo(child.type);
                collectTokens(typeInfo);
                const postfix = child.flags.isOptional ? "?" : "";
                let prefix = "";
                if (child.flags.isReadonly) {
                  prefix = "readonly ";
                } else if (child.flags.isRest) {
                  prefix = "...";
                } else if (child.flags.isAbstract) {
                  prefix = "abstract ";
                } else if (child.flags.isPrivate) {
                  prefix = "private ";
                } else if (child.flags.isStatic) {
                  prefix = "static ";
                } else if (child.flags.isProtected) {
                  prefix = "protected ";
                }

                return `${prefix}${keyName}${postfix}: ${typeInfo.code}`;
              }

              if (child.signatures) {
                const typeInfo = child.signatures.map((sig) =>
                  getFunctionSignatureTypeInfo(
                    sig,
                    child.signatures!.length > 1,
                  ),
                );

                typeInfo.forEach(collectTokens);

                let sigCode = typeInfo.map((s) => s.code).join("; ");
                if (child.signatures.length > 1) {
                  sigCode = `{ ${sigCode} }`;
                }

                return `${keyName}: ${sigCode} `;
              }

              return "";
            })
            .join("; ")}`;
        }

        if (typeObj.declaration.signatures) {
          const isMuli =
            typeObj.declaration.signatures.length > 1 || inner.length > 0;
          const typeInfo = typeObj.declaration.signatures.map((sig) =>
            getFunctionSignatureTypeInfo(sig, isMuli),
          );

          typeInfo.forEach(collectTokens);

          const sigCode = typeInfo.map((s) => s.code).join("; ");

          if (!inner) {
            if (typeObj.declaration.signatures.length === 1) {
              return sigCode;
            }

            return `{ ${sigCode} }`;
          }

          inner = `${sigCode} ; ${inner}`;
        }

        return `{ ${inner} }`;
      }

      case "reference": {
        // Foo
        tokens.push({
          name: typeObj.name,
          package: typeObj.package,
        });

        // SomeGeneric<T>
        if (typeObj.typeArguments) {
          const typeInfos = typeObj.typeArguments.map(getTypeInfo);
          typeInfos.forEach(collectTokens);
          return `${typeObj.name}<${typeInfos.map((t) => t.code).join(", ")}>`;
        }

        return typeObj.name;
      }

      // (T) | (U) | (V) ...
      case "union": {
        return typeObj.types
          .map((t) => {
            const typeInfo = getTypeInfo(t);
            collectTokens(typeInfo);
            if (t.type === "literal" || t.type === "intrinsic") {
              return typeInfo.code;
            }
            return `(${typeInfo.code})`;
          })
          .join(" | ");
      }

      // null, undefined, "hello", 12 etc
      case "literal": {
        if (typeof typeObj.value === "string") {
          return `"${typeObj.value}"`;
        }

        return typeObj.value + "";
      }

      // Foo[]
      case "array": {
        const typeInfo = getTypeInfo(typeObj.elementType);
        collectTokens(typeInfo);

        return `Array<${typeInfo.code}>`;
      }

      // Foo extends Bar ? Baz : Qux
      case "conditional": {
        const checktypeInfo = getTypeInfo(typeObj.checkType);
        const extendstypeInfo = getTypeInfo(typeObj.extendsType);
        const truetypeInfo = getTypeInfo(typeObj.trueType);
        const falsetypeInfo = getTypeInfo(typeObj.falseType);

        collectTokens(checktypeInfo);
        collectTokens(extendstypeInfo);
        collectTokens(truetypeInfo);
        collectTokens(falsetypeInfo);

        return `${checktypeInfo.code} extends ${extendstypeInfo.code} ? ${truetypeInfo.code} : ${falsetypeInfo.code}`;
      }

      // Foo[Bar]
      case "indexedAccess": {
        const ObjtypeInfo = getTypeInfo(typeObj.objectType);
        const ValuetypeInfo = getTypeInfo(typeObj.indexType);

        collectTokens(ObjtypeInfo);
        collectTokens(ValuetypeInfo);

        return `${ObjtypeInfo.code}[${ValuetypeInfo.code}]`;
      }

      // (T) & (U) & (V) ...
      case "intersection": {
        return typeObj.types
          .map((t) => {
            const typeInfo = getTypeInfo(t);
            collectTokens(typeInfo);
            if (t.type === "literal" || t.type === "intrinsic") {
              return typeInfo.code;
            }
            return `(${typeInfo.code})`;
          })
          .join(" & ");
      }

      // { [Foo in Bar]: Baz }
      case "mapped": {
        const typeInfo = getTypeInfo(typeObj.parameterType);
        const templatetypeInfo = getTypeInfo(typeObj.templateType);

        collectTokens(typeInfo);
        collectTokens(templatetypeInfo);

        return `{[${typeObj.parameter} in ${typeInfo.code}] : ${templatetypeInfo.code}}`;
      }

      // [A, B, C, ..]
      case "tuple": {
        if (typeObj.elements) {
          return `[${typeObj.elements
            .map((el) => {
              const typeInfo = getTypeInfo(el);
              collectTokens(typeInfo);
              return typeInfo.code;
            })
            .join(", ")}]`;
        }

        return `[]`;
      }

      // typeof Foo
      case "query": {
        const typeInfo = getTypeInfo(typeObj.queryType);
        collectTokens(typeInfo);

        return `typeof ${typeInfo.code}`;
      }

      // (keyof" | "unique" | "readonly") Foo
      case "typeOperator": {
        const typeInfo = getTypeInfo(typeObj.target);
        collectTokens(typeInfo);
        return `${typeObj.operator} ${typeInfo.code}`;
      }

      // `xxx${Foo}yyy`
      case "templateLiteral": {
        return (
          "`" +
          typeObj.head +
          typeObj.tail
            .map((t) => {
              const typeInfo = getTypeInfo(t[0]);
              collectTokens(typeInfo);
              return `\${${typeInfo.code}}` + t[1];
            })
            .join("") +
          "`"
        );
      }

      // infer Foo
      case "inferred": {
        tokens.push({
          name: typeObj.name,
        });

        return `infer ${typeObj.name}`;
      }

      // ...(Foo)
      case "rest": {
        const typeInfo = getTypeInfo(typeObj.elementType);
        collectTokens(typeInfo);
        return `...(${typeInfo.code})`;
      }

      case "unknown": {
        return typeObj.name;
      }

      // Foo is (Bar)
      case "predicate": {
        if (typeObj.targetType) {
          const typeInfo = getTypeInfo(typeObj.targetType);
          collectTokens(typeInfo);
          return `${typeObj.name} is (${typeInfo.code})`;
        }
        throw new Error("Failed to get readable type of type 'predicate' ");
      }

      // foo: Foo
      case "namedTupleMember": {
        const typeInfo = getTypeInfo(typeObj.element);
        collectTokens(typeInfo);
        return `${typeObj.name}: ${typeInfo.code}`;
      }

      // Foo?
      case "optional": {
        const typeInfo = getTypeInfo(typeObj.elementType);
        collectTokens(typeInfo);
        return `${typeInfo.code}?`;
      }

      default: {
        // this should never happen
        throw new Error("Failed to create a readable type for type");
      }
    }
  }

  return {
    code: getCode(),
    tokens,
  };
}

// ( (arg1: type1, arg2: type2 ) => ReturnType )
export function getFunctionSignatureTypeInfo(
  signature: JSONOutput.SignatureReflection,
  hasMultipleSig: boolean,
): TypeInfo {
  const tokens: TokenInfo[] = [];

  let parametersCode = "";

  if (signature.parameters) {
    const functionParams = getFunctionParametersDoc(signature.parameters);
    const paramTypeInfo = getParametersSignature(functionParams);
    parametersCode = paramTypeInfo.code;
    paramTypeInfo.tokens?.forEach((t) => tokens.push(t));
  }

  const returntypeInfo = signature.type
    ? getTypeInfo(signature.type)
    : undefined;
  returntypeInfo?.tokens?.forEach((r) => tokens.push(r));

  const returnType = returntypeInfo
    ? `${hasMultipleSig ? ":" : "=>"} ${returntypeInfo.code}`
    : "";

  return {
    code: `(${parametersCode}) ${returnType}`,
    tokens,
  };
}

// if the key has a space or a dash, wrap it in quotes
function createValidKey(str: string) {
  if (str.includes(" ") || str.includes("-")) {
    return `"${str}"`;
  }
  return str;
}
