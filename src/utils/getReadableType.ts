import type { JSONOutput } from "typedoc";

export function getReadableType(typeObj: JSONOutput.SomeType): string {
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
              return `${keyName}: ${getReadableType(child.type)}`;
            }
            if (child.signatures) {
              let sigCode = child.signatures
                .map((sig) =>
                  readableFunctionSignature(sig, child.signatures!.length > 1),
                )
                .join("; ");

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
        const sigCode = typeObj.declaration.signatures
          .map((sig) => readableFunctionSignature(sig, isMuli))
          .join("; ");

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
      // SomeGeneric<T>
      if (typeObj.typeArguments) {
        return `${typeObj.name}<${typeObj.typeArguments
          .map(getReadableType)
          .join(", ")}>`;
      }

      return typeObj.name;
    }

    // (T) | (U) | (V) ...
    case "union": {
      return typeObj.types.map((t) => `(${getReadableType(t)})`).join(" | ");
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
      const type = getReadableType(typeObj.elementType);

      // larger types should be Array<SomeType> so that the type it is more readable
      if (type.length > 50) {
        return `Array<${type}>`;
      }
      return `${type}[]`;
    }

    // Foo extends Bar ? Baz : Qux
    case "conditional": {
      return `${getReadableType(typeObj.checkType)} extends ${getReadableType(
        typeObj.extendsType,
      )} ? ${getReadableType(typeObj.trueType)} : ${getReadableType(
        typeObj.falseType,
      )}`;
    }

    // Foo[Bar]
    case "indexedAccess": {
      return `${getReadableType(typeObj.objectType)}[${getReadableType(
        typeObj.indexType,
      )}]`;
    }

    // (T) & (U) & (V) ...
    case "intersection": {
      return typeObj.types.map((t) => `${getReadableType(t)}`).join(" & ");
    }

    // { [Foo in Bar]: Baz }
    case "mapped": {
      return `{[${typeObj.parameter} in ${getReadableType(
        typeObj.parameterType,
      )}] : ${getReadableType(typeObj.templateType)}}`;
    }

    // [A, B, C, ..]
    case "tuple": {
      if (typeObj.elements) {
        return `[${typeObj.elements.map(getReadableType).join(", ")}]`;
      }
      return `[]`;
    }

    // typeof Foo
    case "query": {
      return `typeof ${getReadableType(typeObj.queryType)}`;
    }

    // (keyof" | "unique" | "readonly") Foo
    case "typeOperator": {
      return `${typeObj.operator} ${getReadableType(typeObj.target)}`;
    }

    // `xxx${Foo}yyy`
    case "templateLiteral": {
      return (
        "`" +
        typeObj.head +
        typeObj.tail
          .map((t) => `\${${getReadableType(t[0])}}` + t[1])
          .join("") +
        "`"
      );
    }

    // infer Foo
    case "inferred": {
      return `infer ${typeObj.name}`;
    }

    // ...(Foo)
    case "rest": {
      return `...(${getReadableType(typeObj.elementType)})`;
    }

    case "unknown": {
      return typeObj.name;
    }

    // Foo is (Bar)
    case "predicate": {
      if (typeObj.targetType) {
        return `${typeObj.name} is (${getReadableType(typeObj.targetType)})`;
      }
      throw new Error("Failed to get readable type of type 'predicate' ");
    }

    // foo: Foo
    case "namedTupleMember": {
      return `${typeObj.name}: ${getReadableType(typeObj.element)}`;
    }

    // Foo?
    case "optional": {
      return `${getReadableType(typeObj.elementType)}?`;
    }

    default: {
      // this should never happen
      throw new Error("Failed to create a readable type for type");
    }
  }
}

// ( (arg1: type1, arg2: type2 ) => ReturnType )
export function readableFunctionSignature(
  signature: JSONOutput.SignatureReflection,
  hasMultipleSig: boolean,
): string {
  const parameters =
    signature.parameters?.map(getParameterCode).join(", ") || "";

  const returnType = signature.type
    ? `${hasMultipleSig ? ":" : "=>"} ${getReadableType(signature.type)}`
    : "";

  return `(${parameters}) ${returnType}`;
}

// if the key has a space or a dash, wrap it in quotes
function createValidKey(str: string) {
  if (str.includes(" ") || str.includes("-")) {
    return `"${str}"`;
  }
  return str;
}

function getParameterCode(parameter: JSONOutput.ParameterReflection): string {
  const name =
    (parameter.flags.isRest ? "..." : "") +
    parameter.name +
    (parameter.flags.isOptional ? "?" : "");

  const defaultValue = parameter.defaultValue
    ? ` = ${parameter.defaultValue}`
    : "";

  return `${name}: ${
    parameter.type ? getReadableType(parameter.type) : "unknown"
  }${defaultValue}`;
}
